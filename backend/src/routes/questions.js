const express = require("express");
const router = express.Router();
const { auth, optionalAuth } = require("../middleware/auth");
const {
  validateQuestion,
  handleValidationErrors,
} = require("../utils/validation");
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  voteQuestion,
} = require("../controllers/questionController");

// @route   GET /api/questions
// @desc    Get all questions with filtering and pagination
// @access  Public
router.get("/", optionalAuth, getQuestions);

// @route   GET /api/questions/:id
// @desc    Get single question by ID
// @access  Public
router.get("/:id", optionalAuth, getQuestionById);

// @route   POST /api/questions
// @desc    Create new question
// @access  Private
router.post(
  "/",
  auth,
  validateQuestion,
  handleValidationErrors,
  createQuestion
);

// @route   POST /api/questions/:id/vote
// @desc    Vote on question
// @access  Private
router.post("/:id/vote", auth, voteQuestion);

module.exports = router;
