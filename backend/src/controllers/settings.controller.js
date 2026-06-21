const pool = require("../config/db");
const bcrypt = require("bcrypt");

/**
 * GET /api/settings
 */
const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    let result = await pool.query(
      `SELECT *
       FROM settings
       WHERE user_id=$1`,
      [userId]
    );

    // Create default settings if none exist
    if (result.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO settings (user_id)
         VALUES ($1)
         RETURNING *`,
        [userId]
      );
    }

    return res.status(200).json({
      success: true,
      settings: result.rows[0],
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings.",
    });
  }
};

/**
 * PUT /api/settings/change-password
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new passwords are required.",
      });
    }

    const user = await pool.query(
      `SELECT password
       FROM users
       WHERE id=$1`,
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const valid = await bcrypt.compare(
      currentPassword,
      user.rows[0].password
    );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users
       SET password=$1
       WHERE id=$2`,
      [hashed, userId]
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password.",
    });
  }
};

/**
 * PUT /api/settings/social-links
 */
const updateSocialLinks = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      linkedin,
      github,
      portfolio,
      website,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE settings
      SET
        linkedin = COALESCE($1, linkedin),
        github = COALESCE($2, github),
        portfolio = COALESCE($3, portfolio),
        website = COALESCE($4, website),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $5
      RETURNING *;
      `,
      [
        linkedin,
        github,
        portfolio,
        website,
        userId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Social links updated successfully.",
      settings: result.rows[0],
    });
  } catch (error) {
    console.error("Update Social Links Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update social links.",
    });
  }
};

/**
 * POST /api/settings/reset
 */
const resetSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      UPDATE settings
      SET
        linkedin = NULL,
        github = NULL,
        portfolio = NULL,
        website = NULL,

        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *;
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Settings reset successfully.",
      settings: result.rows[0],
    });
  } catch (error) {
    console.error("Reset Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset settings.",
    });
  }
};

/**
 * DELETE /api/settings/delete-account
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(
      `DELETE FROM users
       WHERE id=$1`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Account Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete account.",
    });
  }
};

module.exports = {
  getSettings,
  changePassword,
  updateSocialLinks,
  resetSettings,
  deleteAccount,
};