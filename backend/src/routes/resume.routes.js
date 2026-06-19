const express = require("express");
const router = express.Router();

const {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
  uploadResume
} = require("../controllers/resume.controller");

const authenticate = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/", authenticate, createResume);
router.post("/upload", authenticate,upload.single("resume"), uploadResume);
router.get("/", authenticate, getAllResumes);
router.get("/:id", authenticate, getResumeById);
router.put("/:id", authenticate, updateResume);
router.delete("/:id", authenticate, deleteResume);


module.exports = router;