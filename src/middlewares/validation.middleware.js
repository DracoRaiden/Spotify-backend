const { body, oneOf, validationResult } = require("express-validator");

// Centralized error handler middleware
async function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Optimized validation rules chain
const registerUserValidationRules = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string")
    .trim() // Removes accidental whitespace spaces
    .isLength({ min: 8, max: 30 })
    .withMessage("Username must be between 8 and 30 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail() // Canonicalizes emails (e.g., lowercase)
    .isLength({ max: 50 })
    .withMessage("Email must be at most 50 characters long"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim() // Removes accidental whitespace spaces
    .isLength({ min: 8, max: 30 })
    .withMessage("Password must be between 8 and 30 characters long"),

  validateRequest,
];

const loginUserValidationRules = [
  // 1. Ensure password is provided
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim() // Removes accidental whitespace spaces
    .isLength({ min: 8, max: 30 })
    .withMessage("Password must be between 8 and 30 characters long"),

  // 2. Accept either email or username in a single input field (e.g., "identifier")
  oneOf(
    [
      body("identifier")
        .notEmpty()
        .isEmail()
        .normalizeEmail() // Canonicalizes emails (e.g., lowercase)
        .isLength({ max: 50 }),
      body("identifier")
        .notEmpty()
        .isString()
        .trim() // Removes accidental whitespace spaces
        .isLength({ min: 8, max: 30 }),
    ],
    { message: "Please provide a valid username or email address" },
  ),

  validateRequest,
];

module.exports = {
  registerUserValidationRules,
  loginUserValidationRules, // Export the login rules
};
