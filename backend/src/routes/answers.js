const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  validateAnswer,
  handleValidationErrors,
} = require("../utils/validation");
const {
  createAnswer,
  voteAnswer,
  acceptAnswer,
} = require("../controllers/answerController");

// @route   POST /api/questions/:questionId/answers
// @desc    Create new answer for a question
// @access  Private
router.post(
  "/:questionId/answers",
  auth,
  validateAnswer,
  handleValidationErrors,
  createAnswer
);

// @route   POST /api/answers/:id/vote
// @desc    Vote on answer
// @access  Private
router.post("/:id/vote", auth, voteAnswer);

// @route   POST /api/answers/:id/accept
// @desc    Accept answer (only question author)
// @access  Private
router.post("/:id/accept", auth, acceptAnswer);

module.exports = router;
