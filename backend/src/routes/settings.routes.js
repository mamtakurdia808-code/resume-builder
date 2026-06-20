const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
    getSettings,
    getUserProfile,
  updatePreferences,
  changePassword,
  updateSocialLinks,
  resetSettings,
  deleteAccount,
} = require ("../controllers/settings.controller");

router.use(authMiddleware)

router.get("/", getSettings);

router.get("/profile", getUserProfile);

router.put("/preferences", updatePreferences);

router.put("/change-password", changePassword);

router.put("/social-links", updateSocialLinks);

router.post("/reset", resetSettings);

router.delete("/delete-account", deleteAccount);

module.exports = router;