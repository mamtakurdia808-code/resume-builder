const pool = require("../config/db");
const reviewResumeWithGroqai = require("../services/reviewService");
const rewriteResume = require("../services/rewriteService");

/**
 * POST /api/ai/review
 * Generate AI Review
 */
const createAIReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const { resume_id, review_type = "full", input_text } = req.body;

    if (!resume_id) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required.",
      });
    }

    // Get Resume
    const resumeResult = await pool.query(
      `SELECT id, title, resume_data
       FROM resumes
       WHERE id = $1 AND user_id = $2`,
      [resume_id, userId]
    );

    if (resumeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const resume = resumeResult.rows[0];

    // Validate that we actually have resume text to analyze
    if (!resume.resume_data) {
      return res.status(400).json({
        success: false,
        message: "Resume has no extracted text. Please re-upload the file.",
      });
    }

    // Gemini Review
    const aiResponse = await reviewResumeWithGroqai({
      resume: resume.resume_data,
      reviewType: review_type,
      inputText: input_text || "",
    });

    // Save Review — store aiResponse as JSONB (pass object directly, not stringified)
    const result = await pool.query(
      `INSERT INTO ai_reviews
         (user_id, resume_id, review_type, input_text, ai_response)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        userId,
        resume_id,
        review_type,
        input_text || null,
        // If the column is jsonb, pass the object; if text, stringify it.
        // Adjust to match your schema — using JSON.stringify is safe for both.
        JSON.stringify(aiResponse),
      ]
    );

    const row = result.rows[0];

    // Parse ai_response back to object if PostgreSQL returned it as a string
    if (typeof row.ai_response === "string") {
      try { row.ai_response = JSON.parse(row.ai_response); } catch (_) {}
    }

    return res.status(201).json({
      success: true,
      message: "AI review generated successfully.",
      review: row,
    });

  } catch (error) {
    console.error("Create AI Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI review.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * GET /api/ai/reviews
 */
const getAIReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         ar.id,
         ar.review_type,
         ar.created_at,
         r.title AS resume_title
       FROM ai_reviews ar
       JOIN resumes r ON ar.resume_id = r.id
       WHERE ar.user_id = $1
       ORDER BY ar.created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      reviews: result.rows,
    });

  } catch (error) {
    console.error("Get AI Reviews Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch AI reviews.",
    });
  }
};

/**
 * GET /api/ai/reviews/:id
 */
const getAIReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         ar.*,
         r.title AS resume_title
       FROM ai_reviews ar
       JOIN resumes r ON ar.resume_id = r.id
       WHERE ar.id = $1 AND ar.user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "AI review not found.",
      });
    }

    const row = result.rows[0];

    // Parse ai_response if stored as a string
    if (typeof row.ai_response === "string") {
      try { row.ai_response = JSON.parse(row.ai_response); } catch (_) {}
    }

    return res.status(200).json({
      success: true,
      review: row,
    });

  } catch (error) {
    console.error("Get AI Review By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch AI review.",
    });
  }
};

/**
 * DELETE /api/ai/reviews/:id
 */
const deleteAIReview = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM ai_reviews
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "AI review not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "AI review deleted successfully.",
    });

  } catch (error) {
    console.error("Delete AI Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete AI review.",
    });
  }
};

const ALLOWED_SECTIONS = [
  "summary",
  "project",
  "experience",
  "skills",
  "achievements",
];

const rewriteResumeContent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resume_id, section, content } = req.body;

    // Validate resume id
    if (!resume_id) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required.",
      });
    }

    // Validate section
    if (!section) {
      return res.status(400).json({
        success: false,
        message: "Section is required.",
      });
    }

    if (!ALLOWED_SECTIONS.includes(section)) {
      return res.status(400).json({
        success: false,
        message: `Invalid section. Allowed sections: ${ALLOWED_SECTIONS.join(
          ", "
        )}.`,
      });
    }

    // Validate content
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content cannot be empty.",
      });
    }

    const cleanContent = content.trim();

    // Check resume ownership
    const resume = await pool.query(
      `SELECT id
       FROM resumes
       WHERE id = $1
       AND user_id = $2`,
      [resume_id, userId]
    );

    if (resume.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    // Rewrite using Gemini
    const aiResponse = await rewriteResume({
  section,
  content: cleanContent,
});

    // Save history
    const review = await pool.query(
      `INSERT INTO ai_reviews
      (
        user_id,
        resume_id,
        review_type,
        input_text,
        ai_response
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        userId,
        resume_id,
        "rewrite",
        cleanContent,
        JSON.stringify({
          section,
          rewritten: aiResponse,
        }),
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Resume rewritten successfully.",
      data: {
        reviewId: review.rows[0].id,
        rewritten: aiResponse,
      },
    });
  } catch (error) {
    console.error("Rewrite Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to rewrite resume.",
      error: error.message,
    });
  }
};

module.exports = {
  createAIReview,
  getAIReviews,
  getAIReviewById,
  deleteAIReview,
  rewriteResumeContent,
};