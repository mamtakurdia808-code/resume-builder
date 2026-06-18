const express = require("express");
const router = express.Router();

const {
  analyzeResume,
  getATSReports,
  getATSReportById,
  deleteATSReport,
} = require("../controllers/ats.controller");

const authMiddleware = require("../middleware/auth.middleware");

// Protect all ATS routes
router.use(authMiddleware);

// Analyze Resume
router.post("/analyze", analyzeResume);

// Reports
router.get("/reports", getATSReports);
router.get("/reports/:id", getATSReportById);
router.delete("/reports/:id", deleteATSReport);

module.exports = router;