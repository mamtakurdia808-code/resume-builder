const express = require("express");
const router = express.Router();

const {
  createJobAnalysis,
  getJobAnalyses,
  getJobAnalysisById,
  deleteJobAnalysis,
} = require("../controllers/jobAnalysis.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/analyze", authMiddleware, createJobAnalysis);

router.get("/", authMiddleware, getJobAnalyses);

router.get("/:id", authMiddleware, getJobAnalysisById);

router.delete("/:id", authMiddleware, deleteJobAnalysis);

module.exports = router;
