const pool = require("../config/db");

/**
 * Create Resume
 */
const createResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, resume_data } = req.body;

    if (!title || !resume_data) {
      return res.status(400).json({
        success: false,
        message: "Title and resume data are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO resumes (user_id, title, resume_data)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, title, resume_data]
    );

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume: result.rows[0],
    });
  } catch (error) {
    console.error("Create Resume Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get All Resumes
 */
const getAllResumes = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, title, created_at, updated_at
       FROM resumes
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      resumes: result.rows,
    });
  } catch (error) {
    console.error("Get Resumes Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get Single Resume
 */
const getResumeById = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    const result = await pool.query(
      `SELECT *
       FROM resumes
       WHERE id = $1 AND user_id = $2`,
      [resumeId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume: result.rows[0],
    });
  } catch (error) {
    console.error("Get Resume Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Update Resume
 */
const updateResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    const { title, resume_data } = req.body;

    const existingResume = await pool.query(
      `SELECT * FROM resumes
       WHERE id = $1 AND user_id = $2`,
      [resumeId, userId]
    );

    if (existingResume.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const result = await pool.query(
      `UPDATE resumes
       SET title = $1,
           resume_data = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [title, resume_data, resumeId]
    );

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume: result.rows[0],
    });
  } catch (error) {
    console.error("Update Resume Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Delete Resume
 */
const deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    const result = await pool.query(
      `DELETE FROM resumes
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [resumeId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete Resume Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
};