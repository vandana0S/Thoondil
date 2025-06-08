const { body, param, validationResult } = require("express-validator");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    });
  }

  next();
};

// User registration validation
const validateUserRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

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

  body("phone")
    .matches(/^[+]?[\d\s\-\(\)]{10,15}$/)
    .withMessage("Please provide a valid phone number"),

  body("role")
    .optional()
    .isIn(["customer", "vendor", "delivery"])
    .withMessage("Role must be customer, vendor, or delivery"),

  handleValidationErrors,
];

// User login validation
const validateUserLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

// Profile update validation
const validateProfileUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("phone")
    .optional()
    .matches(/^[+]?[\d\s\-\(\)]{10,15}$/)
    .withMessage("Please provide a valid phone number"),

  body("profilePicture")
    .optional()
    .isURL({ protocols: ["http", "https"] })
    .withMessage("Profile picture must be a valid URL"),

  handleValidationErrors,
];

// Address validation
const validateAddress = [
  body("label").trim().notEmpty().withMessage("Address label is required"),

  body("street").trim().notEmpty().withMessage("Street address is required"),

  body("city").trim().notEmpty().withMessage("City is required"),

  body("state").trim().notEmpty().withMessage("State is required"),

  body("zipCode").trim().notEmpty().withMessage("ZIP code is required"),

  body("location.coordinates")
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be an array of [longitude, latitude]"),

  body("location.coordinates.*")
    .optional()
    .isFloat()
    .withMessage("Coordinates must be valid numbers"),

  handleValidationErrors,
];

// MongoDB ObjectId validation
const validateObjectId = (fieldName) => [
  param(fieldName).isMongoId().withMessage(`Invalid ${fieldName} format`),

  handleValidationErrors,
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProfileUpdate,
  validateAddress,
  validateObjectId,
  handleValidationErrors,
};
