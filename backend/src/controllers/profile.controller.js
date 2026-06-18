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
      profile_picture,
      currentrole,
      experience_years,
    } = req.body;

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
        profile_picture = $7,
        currentrole = $8,
        experience_years = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
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
        full_name,
        phone,
        location,
        linkedin,
        github,
        portfolio,
        profile_picture,
        currentrole,
        experience_years,
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

module.exports = {
  getProfile,
  updateProfile,
};

