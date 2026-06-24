const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Get Logged-in User Profile
 * GET /api/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        phone,
        location,
        linkedin,
        github,
        portfolio,
        profile_picture,
        currentrole,
        experience_years,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: rows[0],
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/**
 * Update User Profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      full_name,
      phone,
      location,
      linkedin,
      github,
      portfolio,
      currentrole,
      experience_years,
    } = req.body;

    // Convert experience_years to integer or NULL
    let experienceYears = null;

    if (
      experience_years !== "" &&
      experience_years !== undefined &&
      experience_years !== null
    ) {
      experienceYears = Number(experience_years);

      if (Number.isNaN(experienceYears) || experienceYears < 0) {
        return res.status(400).json({
          success: false,
          message: "Experience years must be a valid non-negative number.",
        });
      }
    }

    const { rows } = await pool.query(
      `
      UPDATE users
      SET
        full_name = $1,
        phone = $2,
        location = $3,
        linkedin = $4,
        github = $5,
        portfolio = $6,
        currentrole = $7,
        experience_years = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING
        id,
        full_name,
        email,
        phone,
        location,
        linkedin,
        github,
        portfolio,
        profile_picture,
        currentrole,
        experience_years,
        created_at,
        updated_at
      `,
      [
        full_name?.trim() || null,
        phone?.trim() || null,
        location?.trim() || null,
        linkedin?.trim() || null,
        github?.trim() || null,
        portfolio?.trim() || null,
        currentrole?.trim() || null,
        experienceYears,
        userId,
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: rows[0],
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a profile image.",
      });
    }
    const imagePath = `/uploads/profile/${req.file.filename}`;

    const result = await pool.query(
      `
      UPDATE users
      SET profile_picture = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING id, full_name, email, profile_picture
      `,
      [imagePath, userId]
    );

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully.",
      profile_picture: imagePath,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Upload Profile Photo:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload profile photo.",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
};

