const Answer = require("../models/Answer");
const Question = require("../models/Question");

// Create new answer
const createAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const answer = new Answer({
      content,
      author: req.user._id,
      question: questionId,
    });

    await answer.save();
    await answer.populate("author", "username avatar reputation");

    // Add answer to question
    question.answers.push(answer._id);
    await question.save();

    res.status(201).json({
      success: true,
      message: "Answer created successfully",
      data: {
        answer: {
          id: answer._id,
          content: answer.content,
          author: answer.author.username,
          votes: 0,
          timestamp: answer.createdAt,
          isAccepted: false,
        },
      },
    });
  } catch (error) {
    console.error("Create answer error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating answer",
    });
  }
};

// Vote on answer
const voteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'up' or 'down'
    const userId = req.user._id;

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    // Check if user is voting on their own answer
    if (answer.author.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot vote on your own answer",
      });
    }

    const hasUpvoted = answer.votes.upvotes.includes(userId);
    const hasDownvoted = answer.votes.downvotes.includes(userId);

    if (type === "up") {
      if (hasUpvoted) {
        // Remove upvote
        answer.votes.upvotes.pull(userId);
      } else {
        // Add upvote and remove downvote if exists
        answer.votes.upvotes.push(userId);
        if (hasDownvoted) {
          answer.votes.downvotes.pull(userId);
        }
      }
    } else if (type === "down") {
      if (hasDownvoted) {
        // Remove downvote
        answer.votes.downvotes.pull(userId);
      } else {
        // Add downvote and remove upvote if exists
        answer.votes.downvotes.push(userId);
        if (hasUpvoted) {
          answer.votes.upvotes.pull(userId);
        }
      }
    }

    await answer.save();

    res.json({
      success: true,
      message: "Vote recorded successfully",
      data: {
        votes: answer.voteCount,
        isUpvoted: answer.votes.upvotes.includes(userId),
        isDownvoted: answer.votes.downvotes.includes(userId),
      },
    });
  } catch (error) {
    console.error("Vote answer error:", error);
    res.status(500).json({
      success: false,
      message: "Server error recording vote",
    });
  }
};

// Accept answer (only question author can do this)
const acceptAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const answer = await Answer.findById(id).populate("question");
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    // Check if user is the question author
    if (answer.question.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the question author can accept answers",
      });
    }

    // Remove acceptance from other answers
    await Answer.updateMany(
      { question: answer.question._id },
      { isAccepted: false }
    );

    // Accept this answer
    answer.isAccepted = true;
    await answer.save();

    // Update question
    const question = await Question.findById(answer.question._id);
    question.isAnswered = true;
    question.acceptedAnswer = answer._id;
    await question.save();

    res.json({
      success: true,
      message: "Answer accepted successfully",
    });
  } catch (error) {
    console.error("Accept answer error:", error);
    res.status(500).json({
      success: false,
      message: "Server error accepting answer",
    });
  }
};

module.exports = {
  createAnswer,
  voteAnswer,
  acceptAnswer,
};
