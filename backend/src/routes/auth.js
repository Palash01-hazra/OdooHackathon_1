const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} = require("../utils/validation");
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", validateRegister, handleValidationErrors, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", validateLogin, handleValidationErrors, login);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", auth, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, updateProfile);

module.exports = router;
