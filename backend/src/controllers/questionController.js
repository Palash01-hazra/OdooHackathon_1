const Question = require("../models/Question");
const Answer = require("../models/Answer");
const User = require("../models/User");

// Get all questions with filtering and pagination
const getQuestions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "newest",
      search,
      tags,
      author,
    } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      query.tags = { $in: tagArray };
    }

    if (author) {
      query.author = author;
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "votes":
        // This will need aggregation for proper vote sorting
        sortOptions = { createdAt: -1 }; // Fallback for now
        break;
      case "active":
        sortOptions = { updatedAt: -1 };
        break;
      case "unanswered":
        query.isAnswered = false;
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const questions = await Question.find(query)
      .populate("author", "username avatar reputation")
      .populate("answers", "author createdAt")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments(query);

    // Calculate vote counts and format response
    const formattedQuestions = questions.map((question) => ({
      id: question._id,
      title: question.title,
      description: question.description,
      tags: question.tags,
      author: question.author.username,
      votes: question.voteCount,
      answers: question.answerCount,
      views: question.views,
      timestamp: question.createdAt,
      isAnswered: question.isAnswered,
      isUpvoted: req.user
        ? question.votes.upvotes.includes(req.user._id)
        : false,
      isDownvoted: req.user
        ? question.votes.downvotes.includes(req.user._id)
        : false,
    }));

    res.json({
      success: true,
      data: {
        questions: formattedQuestions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get questions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching questions",
    });
  }
};

// Get single question by ID
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate("author", "username avatar reputation")
      .populate({
        path: "answers",
        populate: {
          path: "author",
          select: "username avatar reputation",
        },
      });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Increment view count
    await Question.findByIdAndUpdate(id, { $inc: { views: 1 } });

    // Format question data
    const formattedQuestion = {
      id: question._id,
      title: question.title,
      description: question.description,
      tags: question.tags,
      author: question.author.username,
      votes: question.voteCount,
      views: question.views + 1,
      timestamp: question.createdAt,
      isUpvoted: req.user
        ? question.votes.upvotes.includes(req.user._id)
        : false,
      isDownvoted: req.user
        ? question.votes.downvotes.includes(req.user._id)
        : false,
      answers: question.answers.map((answer) => ({
        id: answer._id,
        content: answer.content,
        author: answer.author.username,
        votes: answer.voteCount,
        timestamp: answer.createdAt,
        isAccepted: answer.isAccepted,
        isUpvoted: req.user
          ? answer.votes.upvotes.includes(req.user._id)
          : false,
        isDownvoted: req.user
          ? answer.votes.downvotes.includes(req.user._id)
          : false,
      })),
    };

    res.json({
      success: true,
      data: {
        question: formattedQuestion,
      },
    });
  } catch (error) {
    console.error("Get question error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching question",
    });
  }
};

// Create new question
const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const question = new Question({
      title,
      description,
      tags: tags.map((tag) => tag.toLowerCase().trim()),
      author: req.user._id,
    });

    await question.save();
    await question.populate("author", "username avatar reputation");

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: {
        question: {
          id: question._id,
          title: question.title,
          description: question.description,
          tags: question.tags,
          author: question.author.username,
          votes: 0,
          answers: 0,
          views: 0,
          timestamp: question.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Create question error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating question",
    });
  }
};

// Vote on question
const voteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'up' or 'down'
    const userId = req.user._id;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Check if user is voting on their own question
    if (question.author.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot vote on your own question",
      });
    }

    const hasUpvoted = question.votes.upvotes.includes(userId);
    const hasDownvoted = question.votes.downvotes.includes(userId);

    if (type === "up") {
      if (hasUpvoted) {
        // Remove upvote
        question.votes.upvotes.pull(userId);
      } else {
        // Add upvote and remove downvote if exists
        question.votes.upvotes.push(userId);
        if (hasDownvoted) {
          question.votes.downvotes.pull(userId);
        }
      }
    } else if (type === "down") {
      if (hasDownvoted) {
        // Remove downvote
        question.votes.downvotes.pull(userId);
      } else {
        // Add downvote and remove upvote if exists
        question.votes.downvotes.push(userId);
        if (hasUpvoted) {
          question.votes.upvotes.pull(userId);
        }
      }
    }

    await question.save();

    res.json({
      success: true,
      message: "Vote recorded successfully",
      data: {
        votes: question.voteCount,
        isUpvoted: question.votes.upvotes.includes(userId),
        isDownvoted: question.votes.downvotes.includes(userId),
      },
    });
  } catch (error) {
    console.error("Vote question error:", error);
    res.status(500).json({
      success: false,
      message: "Server error recording vote",
    });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  voteQuestion,
};
