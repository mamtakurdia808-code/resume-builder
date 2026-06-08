const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
} = require("../controllers/auth.controller");

const authenticationToken = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile",authenticationToken, getProfile);

module.exports = router;