const pool = require("../config/db");
const { analyzeJobDescription } = require("../services/jobAnalysisService");

/**
 * POST /api/job-analysis/analyze
 */
const createJobAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      jobTitle,
      companyName,
      jobDescription,
    } = req.body;

    // Validation
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job description is required.",
      });
    }

    // Analyze using Gemini
    const analysis = await analyzeJobDescription({
      jobTitle: jobTitle,
      companyName: companyName,
      jobDescription: jobDescription.trim(),
    });

    // Save into database
    const result = await pool.query(
      `INSERT INTO job_analysis
      (
        user_id,
        job_title,
        company_name,
        job_description,
        analysis
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        userId,
        jobTitle || null,
        companyName || null,
        jobDescription.trim(),
        JSON.stringify(analysis),
      ]
    );

    res.status(201).json({
  success: true,
  message: "Job analysis created successfully.",
  analysis,
  id: result.rows[0].id,
});
  } catch (error) {
    console.error("Create Job Analysis Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to analyze job description.",
    });
  }
};

/**
 * GET /api/job-analysis
 */
const getJobAnalyses = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM job_analysis
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      analyses: result.rows,
    });
  } catch (error) {
    console.error("Get Job Analyses Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analyses.",
    });
  }
};

/**
 * GET /api/job-analysis/:id
 */
const getJobAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM job_analysis
       WHERE id=$1
       AND user_id=$2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found.",
      });
    }

    res.status(200).json({
      success: true,
      analysis: result.rows[0],
    });
  } catch (error) {
    console.error("Get Job Analysis Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analysis.",
    });
  }
};

/**
 * DELETE /api/job-analysis/:id
 */
const deleteJobAnalysis = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM job_analysis
       WHERE id=$1
       AND user_id=$2
       RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job analysis deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Job Analysis Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete analysis.",
    });
  }
};

module.exports = {
  createJobAnalysis,
  getJobAnalyses,
  getJobAnalysisById,
  deleteJobAnalysis,
};
