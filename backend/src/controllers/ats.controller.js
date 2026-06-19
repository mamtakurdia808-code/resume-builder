const pool = require("../config/db");
const analyzeResumeWithGemini = require("../services/atsService");

const extractPdfText = require("../utils/extractPdf");
const extractDocxText = require("../utils/extractDocx");

/**
 * POST /api/ats/analyze
 * Analyze Resume using Gemini
 */
const analyzeResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      resume_id,
      job_title,
      company_name,
      job_description,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!resume_id && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select or upload a resume.",
       });
    }

    if (!job_title) {
      return res.status(400).json({
        success: false,
        message: "Job title is required.",
      });
    }

    if (!job_description) {
      return res.status(400).json({
        success: false,
        message: "Job description is required.",
      });
    }

    // -----------------------------
    // Fetch Resume
    // -----------------------------

    // -----------------------------
// Get Resume Data
// -----------------------------

let resumeData = "";
let actualResumeId = null;

if (resume_id) {
  const resumeResult = await pool.query(
    `
    SELECT id, title, resume_data
    FROM resumes
    WHERE id = $1
    AND user_id = $2
    `,
    [resume_id, userId]
  );

  if (resumeResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Resume not found.",
    });
  }

  actualResumeId = resumeResult.rows[0].id;
  resumeData = resumeResult.rows[0].resume_data;
} else {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "Resume file is required.",
    });
  }

  if (file.mimetype === "application/pdf") {
    resumeData = await extractPdfText(file.buffer);
  } else {
    resumeData = await extractDocxText(file.buffer);
  }
}

    // -----------------------------
    // Gemini Analysis
    // -----------------------------

    const analysis = await analyzeResumeWithGemini({
      resume: resumeData,
      jobTitle: job_title,
      companyName: company_name,
      jobDescription: job_description,
    });

    // -----------------------------
    // Save Report
    // -----------------------------

    const reportResult = await pool.query(
      `
      INSERT INTO ats_reports
      (
        user_id,
        resume_id,
        job_title,
        company_name,
        ats_score,
        keyword_match,
        formatting_score,
        skills_score,
        experience_score,
        education_score,
        matched_keywords,
        missing_keywords,
        strengths,
        weaknesses,
        suggestions
      )

      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15
      )

      RETURNING *
      `,
      [
        userId,
        actualResumeId,
        job_title,
        company_name,

        analysis.ats_score,
        analysis.keyword_match,
        analysis.formatting_score,
        analysis.skills_score,
        analysis.experience_score,
        analysis.education_score,

        JSON.stringify(analysis.matched_keywords),
        JSON.stringify(analysis.missing_keywords),
        JSON.stringify(analysis.strengths),
        JSON.stringify(analysis.weaknesses),
        JSON.stringify(analysis.suggestions),
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully.",
      report: reportResult.rows[0],
    });

  } catch (error) {

    console.error("ATS Analyze Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });

  }
};

/**
 * GET /api/ats/reports
 * Get all ATS reports of logged-in user
 */
const getATSReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const reports = await pool.query(
      `
      SELECT
          ar.id,
          ar.resume_id,
          r.title AS resume_title,
          ar.job_title,
          ar.company_name,
          ar.ats_score,
          ar.keyword_match,
          ar.formatting_score,
          ar.skills_score,
          ar.experience_score,
          ar.education_score,
          ar.created_at
      FROM ats_reports ar
      JOIN resumes r
      ON ar.resume_id = r.id
      WHERE ar.user_id = $1
      ORDER BY ar.created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      count: reports.rows.length,
      reports: reports.rows,
    });
  } catch (error) {
    console.error("Get ATS Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch ATS reports.",
    });
  }
};

/**
 * GET /api/ats/reports/:id
 * Get single ATS report
 */
const getATSReportById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const report = await pool.query(
      `
      SELECT
          ar.*,
          r.title AS resume_title
      FROM ats_reports ar
      JOIN resumes r
      ON ar.resume_id = r.id
      WHERE ar.id = $1
      AND ar.user_id = $2
      `,
      [id, userId]
    );

    if (report.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ATS report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      report: report.rows[0],
    });
  } catch (error) {
    console.error("Get ATS Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch ATS report.",
    });
  }
};

/**
 * DELETE /api/ats/reports/:id
 * Delete ATS report
 */
const deleteATSReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await pool.query(
      `
      DELETE FROM ats_reports
      WHERE id = $1
      AND user_id = $2
      RETURNING id
      `,
      [id, userId]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ATS report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "ATS report deleted successfully.",
    });
  } catch (error) {
    console.error("Delete ATS Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete ATS report.",
    });
  }
};

module.exports = {
  analyzeResume,
  getATSReports,
  getATSReportById,
  deleteATSReport,
};