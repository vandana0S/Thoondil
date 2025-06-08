const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const User = require("../models/User");
const { AppError, asyncHandler } = require("../middlewares/errorHandler");
const {
  sendSuccessResponse,
  sendPaginatedResponse,
  calculatePagination,
} = require("../utils/response");

const getVendorProfile = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ ownerId: req.user._id }).populate(
    "ownerId",
    "name email phone"
  );
  if (!vendor) {
    return next(new AppError("Vendor profile not found", 404));
  }
  sendSuccessResponse(
    res,
    200,
    "Vendor profile retrieved successfully",
    vendor
  );
});

const createOrUpdateVendorProfile = asyncHandler(async (req, res, next) => {
  const {
    shopName,
    description,
    shopAddress,
    location,
    pincodesServed,
    openingTime,
    closingTime,
    phoneNumber,
    businessLicense,
  } = req.body;
  let vendor = await Vendor.findOne({ ownerId: req.user._id });
  const vendorData = {
    shopName,
    description,
    shopAddress,
    location,
    pincodesServed,
    openingTime,
    closingTime,
    phoneNumber,
    businessLicense,
  };
  if (vendor) {
    vendor = await Vendor.findByIdAndUpdate(vendor._id, vendorData, {
      new: true,
      runValidators: true,
    }).populate("ownerId", "name email phone");
    sendSuccessResponse(
      res,
      200,
      "Vendor profile updated successfully",
      vendor
    );
  } else {
    vendorData.ownerId = req.user._id;
    vendor = await Vendor.create(vendorData);
    await vendor.populate("ownerId", "name email phone");
    sendSuccessResponse(
      res,
      201,
      "Vendor profile created successfully",
      vendor
    );
  }
});

const toggleVendorStatus = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ ownerId: req.user._id });
  if (!vendor) {
    return next(new AppError("Vendor profile not found", 404));
  }
  vendor.isOpen = !vendor.isOpen;
  await vendor.save();
  const status = vendor.isOpen ? "opened" : "closed";
  sendSuccessResponse(res, 200, `Shop ${status} successfully`, {
    isOpen: vendor.isOpen,
  });
});

const getVendorProducts = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ ownerId: req.user._id });
  if (!vendor) {
    return next(new AppError("Vendor profile not found", 404));
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const category = req.query.category;
  const availability = req.query.availability;
  const filter = { vendorId: vendor._id };
  if (category) {
    filter.category = category;
  }
  if (availability !== undefined) {
    filter.isAvailable = availability === "true";
  }
  const totalProducts = await Product.countDocuments(filter);
  const pagination = calculatePagination(page, limit, totalProducts);
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit);
  sendPaginatedResponse(
    res,
    200,
    "Products retrieved successfully",
    products,
    pagination
  );
});

const addProduct = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ ownerId: req.user._id });
  if (!vendor) {
    return next(new AppError("Vendor profile not found", 404));
  }
  if (!vendor.isVerified) {
    return next(new AppError("Vendor must be verified to add products", 403));
  }
  const productData = {
    ...req.body,
    vendorId: vendor._id,
  };
  const product = await Product.create(productData);
  sendSuccessResponse(res, 201, "Product added successfully", product);
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ ownerId: req.user._id });
  if (!vendor) {
    return next(new AppError("Vendor profile not found", 404));
  }
  const product = await Product.findOne({
    _id: req.params.productId,
    vendorId: vendor._id,
  });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  delete req.body.vendorId;
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.productId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  sendSuccessResponse(res, 200, "Product updated successfully", updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ ownerId: req.user._id });
  if (!vendor) {
    return next(new AppError("Vendor profile not found", 404));
  }
  const product = await Product.findOne({
    _id: req.params.productId,
    vendorId: vendor._id,
  });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  await Product.findByIdAndDelete(req.params.productId);
  sendSuccessResponse(res, 200, "Product deleted successfully", null);
});

const getVendorProduct = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ ownerId: req.user._id });
  if (!vendor) {
    return next(new AppError("Vendor profile not found", 404));
  }
  const product = await Product.findOne({
    _id: req.params.productId,
    vendorId: vendor._id,
  });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  sendSuccessResponse(res, 200, "Product retrieved successfully", product);
});

const updateProductStock = asyncHandler(async (req, res, next) => {
  const { stockQuantity, isAvailable } = req.body;
  const vendor = await Vendor.findOne({ ownerId: req.user._id });
  if (!vendor) {
    return next(new AppError("Vendor profile not found", 404));
  }
  const product = await Product.findOne({
    _id: req.params.productId,
    vendorId: vendor._id,
  });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  if (stockQuantity !== undefined) {
    product.stockQuantity = stockQuantity;
  }
  if (isAvailable !== undefined) {
    product.isAvailable = isAvailable;
  }
  if (product.stockQuantity === 0) {
    product.isAvailable = false;
  }
  await product.save();
  sendSuccessResponse(res, 200, "Product stock updated successfully", {
    stockQuantity: product.stockQuantity,
    isAvailable: product.isAvailable,
  });
});

const getVendorDashboard = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ ownerId: req.user._id });
  if (!vendor) {
    return next(new AppError("Vendor profile not found", 404));
  }
  const [totalProducts, availableProducts, outOfStockProducts, totalSold] =
    await Promise.all([
      Product.countDocuments({ vendorId: vendor._id }),
      Product.countDocuments({ vendorId: vendor._id, isAvailable: true }),
      Product.countDocuments({ vendorId: vendor._id, stockQuantity: 0 }),
      Product.aggregate([
        { $match: { vendorId: vendor._id } },
        { $group: { _id: null, totalSold: { $sum: "$totalSold" } } },
      ]),
    ]);
  const dashboardData = {
    vendor: {
      shopName: vendor.shopName,
      isVerified: vendor.isVerified,
      isOpen: vendor.isOpen,
      averageRating: vendor.averageRating,
      totalOrders: vendor.totalOrders,
    },
    products: {
      total: totalProducts,
      available: availableProducts,
      outOfStock: outOfStockProducts,
    },
    sales: {
      totalSold: totalSold[0]?.totalSold || 0,
    },
  };
  sendSuccessResponse(
    res,
    200,
    "Dashboard data retrieved successfully",
    dashboardData
  );
});

module.exports = {
  getVendorProfile,
  createOrUpdateVendorProfile,
  toggleVendorStatus,
  getVendorProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getVendorProduct,
  updateProductStock,
  getVendorDashboard,
};
