const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile
} = require("../controllers/profile.controller");

const authenticationToken = require("../middleware/auth.middleware");

router.get("/",authenticationToken, getProfile);
router.put("/", authenticationToken, updateProfile);

module.exports = router;
