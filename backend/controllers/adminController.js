const Vendor = require("../models/Vendor");
const User = require("../models/User");
const Product = require("../models/Product");
const { AppError, asyncHandler } = require("../middlewares/errorHandler");
const {
  sendSuccessResponse,
  sendPaginatedResponse,
  calculatePagination,
} = require("../utils/response");

const getAllVendors = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const search = req.query.search;

  const filter = {};

  if (status === "pending") {
    filter.isVerified = false;
    filter.rejectionReason = { $exists: false };
  } else if (status === "verified") {
    filter.isVerified = true;
  } else if (status === "rejected") {
    filter.isVerified = false;
    filter.rejectionReason = { $exists: true };
  }

  let query = Vendor.find(filter).populate("ownerId", "name email phone");

  if (search) {
    query = query.find({
      $or: [
        { shopName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "shopAddress.city": { $regex: search, $options: "i" } },
      ],
    });
  }

  const vendors = await query
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalVendors = await Vendor.countDocuments(filter);
  const pagination = calculatePagination(page, limit, totalVendors);

  sendPaginatedResponse(
    res,
    200,
    "Vendors retrieved successfully",
    vendors,
    pagination
  );
});

const getVendorDetails = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.vendorId).populate(
    "ownerId",
    "name email phone createdAt"
  );

  if (!vendor) {
    return next(new AppError("Vendor not found", 404));
  }

  const productCount = await Product.countDocuments({ vendorId: vendor._id });

  const vendorData = {
    ...vendor.toObject(),
    productCount,
  };

  sendSuccessResponse(res, 200, "Vendor details retrieved", vendorData);
});

const verifyVendor = asyncHandler(async (req, res, next) => {
  const { action, rejectionReason } = req.body;

  if (!["approve", "reject"].includes(action)) {
    return next(new AppError("Action must be 'approve' or 'reject'", 400));
  }

  if (action === "reject" && !rejectionReason) {
    return next(new AppError("Rejection reason is required", 400));
  }

  const vendor = await Vendor.findById(req.params.vendorId);

  if (!vendor) {
    return next(new AppError("Vendor not found", 404));
  }

  if (action === "approve") {
    vendor.isVerified = true;
    vendor.verifiedAt = new Date();
    vendor.verifiedBy = req.user._id;
    vendor.rejectionReason = null;
  } else {
    vendor.isVerified = false;
    vendor.rejectionReason = rejectionReason;
    vendor.verifiedAt = null;
    vendor.verifiedBy = null;
  }

  await vendor.save();

  const message =
    action === "approve" ? "Vendor approved successfully" : "Vendor rejected";

  sendSuccessResponse(res, 200, message, {
    vendorId: vendor._id,
    isVerified: vendor.isVerified,
    rejectionReason: vendor.rejectionReason,
  });
});

const getAdminDashboard = asyncHandler(async (req, res, next) => {
  const [
    totalUsers,
    totalVendors,
    verifiedVendors,
    pendingVendors,
    totalProducts,
    activeProducts,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Vendor.countDocuments(),
    Vendor.countDocuments({ isVerified: true }),
    Vendor.countDocuments({
      isVerified: false,
      rejectionReason: { $exists: false },
    }),
    Product.countDocuments(),
    Product.countDocuments({ isAvailable: true, stockQuantity: { $gt: 0 } }),
  ]);

  const recentVendors = await Vendor.find({
    isVerified: false,
    rejectionReason: { $exists: false },
  })
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  const dashboardData = {
    stats: {
      users: {
        total: totalUsers,
      },
      vendors: {
        total: totalVendors,
        verified: verifiedVendors,
        pending: pendingVendors,
        rejected: totalVendors - verifiedVendors - pendingVendors,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        inactive: totalProducts - activeProducts,
      },
    },
    recentVendors: recentVendors.map((vendor) => ({
      _id: vendor._id,
      shopName: vendor.shopName,
      ownerName: vendor.ownerId.name,
      ownerEmail: vendor.ownerId.email,
      createdAt: vendor.createdAt,
      shopAddress: vendor.shopAddress,
    })),
  };

  sendSuccessResponse(
    res,
    200,
    "Dashboard data retrieved successfully",
    dashboardData
  );
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const role = req.query.role;
  const search = req.query.search;

  const filter = {};

  if (role && ["customer", "vendor", "delivery"].includes(role)) {
    filter.role = role;
  }

  let query = User.find(filter);

  if (search) {
    query = query.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    });
  }

  const users = await query
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalUsers = await User.countDocuments(filter);
  const pagination = calculatePagination(page, limit, totalUsers);

  const publicUsers = users.map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
  }));

  sendPaginatedResponse(
    res,
    200,
    "Users retrieved successfully",
    publicUsers,
    pagination
  );
});

const toggleUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user._id.toString() === req.user._id.toString()) {
    return next(new AppError("Cannot modify your own account status", 400));
  }

  user.isActive = !user.isActive;
  await user.save();

  const status = user.isActive ? "activated" : "deactivated";

  sendSuccessResponse(res, 200, `User ${status} successfully`, {
    userId: user._id,
    isActive: user.isActive,
  });
});

module.exports = {
  getAllVendors,
  getVendorDetails,
  verifyVendor,
  getAdminDashboard,
  getAllUsers,
  toggleUserStatus,
};
