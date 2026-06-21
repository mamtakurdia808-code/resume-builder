const express = require("express");
const router = express.Router();
const upload = require("../middleware/profileUpload.middleware");

const {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} = require("../controllers/profile.controller");

const authenticationToken = require("../middleware/auth.middleware");

router.get("/",authenticationToken, getProfile);
router.put("/", authenticationToken, updateProfile);
router.put("/photo", authenticationToken, upload.single("profile_picture"), uploadProfilePhoto);

module.exports = router;