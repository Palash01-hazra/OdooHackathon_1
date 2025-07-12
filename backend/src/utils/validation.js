const { body, validationResult } = require("express-validator");

// Validation rules for user registration
const validateRegister = [
  body("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

// Validation rules for user login
const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("Password is required"),
];

// Validation rules for questions
const validateQuestion = [
  body("title")
    .isLength({ min: 10, max: 200 })
    .withMessage("Title must be between 10 and 200 characters"),

  body("description")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters long"),

  body("tags")
    .isArray({ min: 1, max: 5 })
    .withMessage("Please provide 1-5 tags")
    .custom((tags) => {
      for (let tag of tags) {
        if (typeof tag !== "string" || tag.length > 20) {
          throw new Error(
            "Each tag must be a string with maximum 20 characters"
          );
        }
      }
      return true;
    }),
];

// Validation rules for answers
const validateAnswer = [
  body("content")
    .isLength({ min: 1 })
    .withMessage("Answer must be at least 10 characters long"),
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateQuestion,
  validateAnswer,
  handleValidationErrors,
};
