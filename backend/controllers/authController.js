const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AppError, asyncHandler } = require("../middlewares/errorHandler");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);
  user.lastLogin = new Date();
  user.save({ validateBeforeSave: false });
  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: user.getPublicProfile(),
  });
};

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, role } = req.body;
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });
  if (existingUser) {
    const field = existingUser.email === email ? "email" : "phone";
    return next(new AppError(`User with this ${field} already exists`, 400));
  }
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || "customer",
  });
  sendTokenResponse(user, 201, res, "User registered successfully");
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }
  if (!user.isActive) {
    return next(new AppError("Account has been deactivated", 401));
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new AppError("Invalid email or password", 401));
  }
  sendTokenResponse(user, 200, res, "Login successful");
});

const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

const logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new AppError("Please provide current and new password", 400));
  }
  const user = await User.findById(req.user._id).select("+password");
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordCorrect) {
    return next(new AppError("Current password is incorrect", 401));
  }
  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, 200, res, "Password updated successfully");
});

const deactivateAccount = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(200).json({
    success: true,
    message: "Account deactivated successfully",
  });
});

module.exports = {
  register,
  login,
  getMe,
  logout,
  updatePassword,
  deactivateAccount,
};
