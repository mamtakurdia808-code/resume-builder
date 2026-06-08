const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/auth.middleware");

const {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
} = require("../controllers/resume.controller");

router.post("/", authenticateToken, createResume);

router.get("/", authenticateToken, getAllResumes);

router.get("/:id", authenticateToken, getResumeById);

router.put("/:id", authenticateToken, updateResume);

router.delete("/:id", authenticateToken, deleteResume);

module.exports = router;