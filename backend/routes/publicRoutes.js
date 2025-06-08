const express = require("express");
const {
  getVendors,
  getVendor,
  getVendorProducts,
  searchVendors,
  getVendorsByPincode,
} = require("../controllers/publicVendorController");
const {
  getProducts,
  getProduct,
  getProductsByCategory,
  getProductCategories,
  getFeaturedProducts,
} = require("../controllers/publicProductController");
const { validateObjectId } = require("../middlewares/validation");
const { optionalAuth } = require("../middlewares/auth");

const router = express.Router();

router.use(optionalAuth);

router.get("/vendors", getVendors);
router.get("/vendors/search", searchVendors);
router.get("/vendors/pincode/:pincode", getVendorsByPincode);
router.get("/vendors/:vendorId", validateObjectId("vendorId"), getVendor);
router.get(
  "/vendors/:vendorId/products",
  validateObjectId("vendorId"),
  getVendorProducts
);

router.get("/products", getProducts);
router.get("/products/categories", getProductCategories);
router.get("/products/featured", getFeaturedProducts);
router.get("/products/category/:category", getProductsByCategory);
router.get("/products/:productId", validateObjectId("productId"), getProduct);

module.exports = router;
