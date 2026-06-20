const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createAIReview,
  getAIReviews,
  getAIReviewById,
  deleteAIReview,
  rewriteResumeContent,
} = require("../controllers/ai.controller");

// All AI review routes require authentication
router.use(authMiddleware);

router.post("/review", createAIReview);

router.get("/reviews", getAIReviews);

router.get("/reviews/:id", getAIReviewById);

router.delete("/reviews/:id", deleteAIReview);

router.post(
  "/rewrite",
  rewriteResumeContent
);

module.exports = router;
