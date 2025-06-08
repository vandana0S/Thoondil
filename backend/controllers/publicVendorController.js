const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const { AppError, asyncHandler } = require("../middlewares/errorHandler");
const {
  sendSuccessResponse,
  sendPaginatedResponse,
  calculatePagination,
} = require("../utils/response");

const getVendors = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  const maxDistance = parseInt(req.query.maxDistance) || 10000;
  const pincode = req.query.pincode;
  const isOpen = req.query.isOpen;

  let vendors;
  let totalVendors;

  const baseQuery = { isVerified: true };

  if (isOpen !== undefined) {
    baseQuery.isOpen = isOpen === "true";
  }

  if (pincode) {
    baseQuery.pincodesServed = pincode;
  }

  if (lat && lon) {
    vendors = await Vendor.findNearLocation(lon, lat, maxDistance)
      .find(baseQuery)
      .sort({ averageRating: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    totalVendors = await Vendor.findNearLocation(lon, lat, maxDistance)
      .find(baseQuery)
      .countDocuments();
  } else {
    vendors = await Vendor.find(baseQuery)
      .sort({ averageRating: -1, totalOrders: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    totalVendors = await Vendor.countDocuments(baseQuery);
  }

  const pagination = calculatePagination(page, limit, totalVendors);

  const publicVendors = vendors.map((vendor) => vendor.publicProfile);

  sendPaginatedResponse(
    res,
    200,
    "Vendors retrieved successfully",
    publicVendors,
    pagination
  );
});

const getVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({
    _id: req.params.vendorId,
    isVerified: true,
  });

  if (!vendor) {
    return next(new AppError("Vendor not found", 404));
  }

  const [totalProducts, availableProducts] = await Promise.all([
    Product.countDocuments({ vendorId: vendor._id }),
    Product.countDocuments({
      vendorId: vendor._id,
      isAvailable: true,
      stockQuantity: { $gt: 0 },
    }),
  ]);

  const vendorData = {
    ...vendor.publicProfile,
    stats: {
      totalProducts,
      availableProducts,
      isCurrentlyOpen: vendor.isCurrentlyOpen(),
    },
  };

  sendSuccessResponse(res, 200, "Vendor retrieved successfully", vendorData);
});

const getVendorProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const category = req.query.category;
  const search = req.query.search;

  const vendor = await Vendor.findOne({
    _id: req.params.vendorId,
    isVerified: true,
  });

  if (!vendor) {
    return next(new AppError("Vendor not found", 404));
  }

  const filter = {
    vendorId: vendor._id,
    isAvailable: true,
    stockQuantity: { $gt: 0 },
  };

  if (category) {
    filter.category = category;
  }

  let products;

  if (search) {
    products = await Product.searchProducts(search, { vendorId: vendor._id })
      .sort({ averageRating: -1, totalSold: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  } else {
    products = await Product.find(filter)
      .sort({ averageRating: -1, totalSold: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  const totalProducts = await Product.countDocuments(filter);
  const pagination = calculatePagination(page, limit, totalProducts);

  const publicProducts = products.map((product) => product.getPublicInfo());

  sendPaginatedResponse(
    res,
    200,
    "Vendor products retrieved successfully",
    publicProducts,
    pagination
  );
});

const searchVendors = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const query = req.query.q;

  if (!query) {
    return next(new AppError("Search query is required", 400));
  }

  const vendors = await Vendor.find({
    isVerified: true,
    $or: [
      { shopName: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { "shopAddress.city": { $regex: query, $options: "i" } },
      { "shopAddress.state": { $regex: query, $options: "i" } },
    ],
  })
    .sort({ averageRating: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalVendors = await Vendor.countDocuments({
    isVerified: true,
    $or: [
      { shopName: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { "shopAddress.city": { $regex: query, $options: "i" } },
      { "shopAddress.state": { $regex: query, $options: "i" } },
    ],
  });

  const pagination = calculatePagination(page, limit, totalVendors);

  const publicVendors = vendors.map((vendor) => vendor.publicProfile);

  sendPaginatedResponse(
    res,
    200,
    "Vendor search results",
    publicVendors,
    pagination
  );
});

const getVendorsByPincode = asyncHandler(async (req, res, next) => {
  const { pincode } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!/^\d{6}$/.test(pincode)) {
    return next(new AppError("Invalid pincode format", 400));
  }

  const vendors = await Vendor.find({
    isVerified: true,
    pincodesServed: pincode,
  })
    .sort({ averageRating: -1, isOpen: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalVendors = await Vendor.countDocuments({
    isVerified: true,
    pincodesServed: pincode,
  });

  const pagination = calculatePagination(page, limit, totalVendors);

  const publicVendors = vendors.map((vendor) => ({
    ...vendor.publicProfile,
    isCurrentlyOpen: vendor.isCurrentlyOpen(),
  }));

  sendPaginatedResponse(
    res,
    200,
    `Vendors serving pincode ${pincode}`,
    publicVendors,
    pagination
  );
});

module.exports = {
  getVendors,
  getVendor,
  getVendorProducts,
  searchVendors,
  getVendorsByPincode,
};
