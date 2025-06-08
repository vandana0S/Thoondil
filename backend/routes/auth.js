const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
  updatePassword,
  deactivateAccount,
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/auth");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../middlewares/validation");

const router = express.Router();

// Public routes
router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);

// Protected routes
router.use(authenticate); // All routes after this middleware require authentication

router.get("/me", getMe);
router.post("/logout", logout);
router.put("/password", updatePassword);
router.delete("/deactivate", deactivateAccount);

module.exports = router;
