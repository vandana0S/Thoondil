const User = require("../models/User");
const { AppError, asyncHandler } = require("../middlewares/errorHandler");

const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

const updateProfile = asyncHandler(async (req, res, next) => {
  const allowedFields = ["name", "phone", "profilePicture"];
  const updates = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });
  if (updates.phone) {
    const existingUser = await User.findOne({
      phone: updates.phone,
      _id: { $ne: req.user._id },
    });
    if (existingUser) {
      return next(new AppError("Phone number already in use", 400));
    }
  }
  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

const getAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("addresses");
  res.status(200).json({
    success: true,
    addresses: user.addresses,
  });
});

const addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.addresses.length >= 5) {
    return next(new AppError("Maximum 5 addresses allowed per user", 400));
  }
  const existingLabel = user.addresses.find(
    (addr) => addr.label.toLowerCase() === req.body.label.toLowerCase()
  );
  if (existingLabel) {
    return next(new AppError("Address with this label already exists", 400));
  }
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({
    success: true,
    message: "Address added successfully",
    address: user.addresses[user.addresses.length - 1],
  });
});

const updateAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    return next(new AppError("Address not found", 404));
  }
  if (req.body.label) {
    const existingLabel = user.addresses.find(
      (addr) =>
        addr.label.toLowerCase() === req.body.label.toLowerCase() &&
        addr._id.toString() !== req.params.addressId
    );
    if (existingLabel) {
      return next(new AppError("Address with this label already exists", 400));
    }
  }
  const allowedFields = [
    "label",
    "street",
    "city",
    "state",
    "zipCode",
    "location",
  ];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      address[field] = req.body[field];
    }
  });
  await user.save();
  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    address,
  });
});

const deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    return next(new AppError("Address not found", 404));
  }
  user.addresses.pull(req.params.addressId);
  await user.save();
  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});

const getAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("addresses");
  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    return next(new AppError("Address not found", 404));
  }
  res.status(200).json({
    success: true,
    address,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddress,
};
