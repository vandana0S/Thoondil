const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const { AppError, asyncHandler } = require("../middlewares/errorHandler");
const {
  sendSuccessResponse,
  sendPaginatedResponse,
  calculatePagination,
} = require("../utils/response");

const getProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search;
  const category = req.query.category;
  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);
  const vendorId = req.query.vendorId;
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const filters = {
    category,
    minPrice,
    maxPrice,
    vendorId,
  };

  Object.keys(filters).forEach(
    (key) => filters[key] === undefined && delete filters[key]
  );

  const products = await Product.searchProducts(search, filters)
    .populate("vendorId", "shopName averageRating isOpen location")
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalProducts = await Product.countDocuments({
    isAvailable: true,
    stockQuantity: { $gt: 0 },
    ...(search && { $text: { $search: search } }),
    ...(category && { category }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      pricePerUnit: {
        ...(minPrice !== undefined && { $gte: minPrice }),
        ...(maxPrice !== undefined && { $lte: maxPrice }),
      },
    }),
    ...(vendorId && { vendorId }),
  });

  const pagination = calculatePagination(page, limit, totalProducts);

  const publicProducts = products.map((product) => ({
    ...product.getPublicInfo(),
    vendor: product.vendorId,
  }));

  sendPaginatedResponse(
    res,
    200,
    "Products retrieved successfully",
    publicProducts,
    pagination
  );
});

const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId).populate(
    "vendorId",
    "shopName averageRating isOpen location shopAddress phoneNumber"
  );

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (!product.isAvailable) {
    return next(new AppError("Product is currently unavailable", 404));
  }

  const productData = {
    ...product.getPublicInfo(),
    vendor: product.vendorId,
  };

  sendSuccessResponse(res, 200, "Product retrieved successfully", productData);
});

const getProductsByCategory = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { category } = req.params;

  const products = await Product.findByCategory(category)
    .populate("vendorId", "shopName averageRating isOpen")
    .sort({ averageRating: -1, totalSold: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalProducts = await Product.countDocuments({
    category,
    isAvailable: true,
    stockQuantity: { $gt: 0 },
  });

  const pagination = calculatePagination(page, limit, totalProducts);

  const publicProducts = products.map((product) => ({
    ...product.getPublicInfo(),
    vendor: product.vendorId,
  }));

  sendPaginatedResponse(
    res,
    200,
    `Products in ${category} category retrieved successfully`,
    publicProducts,
    pagination
  );
});

const getProductCategories = asyncHandler(async (req, res, next) => {
  const categories = await Product.distinct("category", {
    isAvailable: true,
    stockQuantity: { $gt: 0 },
  });

  sendSuccessResponse(
    res,
    200,
    "Categories retrieved successfully",
    categories
  );
});

const getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 12;

  const [topRated, bestSelling, newest] = await Promise.all([
    Product.findAvailable()
      .populate("vendorId", "shopName averageRating isOpen")
      .sort({ averageRating: -1, totalRatings: -1 })
      .limit(Math.ceil(limit / 3)),

    Product.findAvailable()
      .populate("vendorId", "shopName averageRating isOpen")
      .sort({ totalSold: -1 })
      .limit(Math.ceil(limit / 3)),

    Product.findAvailable()
      .populate("vendorId", "shopName averageRating isOpen")
      .sort({ createdAt: -1 })
      .limit(Math.ceil(limit / 3)),
  ]);

  const featuredProducts = {
    topRated: topRated.map((p) => ({
      ...p.getPublicInfo(),
      vendor: p.vendorId,
    })),
    bestSelling: bestSelling.map((p) => ({
      ...p.getPublicInfo(),
      vendor: p.vendorId,
    })),
    newest: newest.map((p) => ({ ...p.getPublicInfo(), vendor: p.vendorId })),
  };

  sendSuccessResponse(
    res,
    200,
    "Featured products retrieved successfully",
    featuredProducts
  );
});

module.exports = {
  getProducts,
  getProduct,
  getProductsByCategory,
  getProductCategories,
  getFeaturedProducts,
};
