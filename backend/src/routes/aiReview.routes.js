const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createAIReview,
  getAIReviews,
  getAIReviewById,
  deleteAIReview,
} = require("../controllers/aiReview.controller");

// All AI review routes require authentication
router.use(authMiddleware);

router.post("/review", createAIReview);

router.get("/reviews", getAIReviews);

router.get("/reviews/:id", getAIReviewById);

router.delete("/reviews/:id", deleteAIReview);

module.exports = router;
