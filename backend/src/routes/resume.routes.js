const express = require("express");
const router = express.Router();

const {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
} = require("../controllers/resume.controller");

const authenticate = require("../middleware/auth.middleware");

router.post("/", authenticate, createResume);
router.get("/", authenticate, getAllResumes);
router.get("/:id", authenticate, getResumeById);
router.put("/:id", authenticate, updateResume);
router.delete("/:id", authenticate, deleteResume);

module.exports = router;