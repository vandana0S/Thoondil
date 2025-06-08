const express = require("express");
const {
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
} = require("../controllers/vendorController");
const { authenticate, authorize } = require("../middlewares/auth");
const { validateObjectId } = require("../middlewares/validation");

const router = express.Router();

router.use(authenticate);
router.use(authorize("vendor"));

router.get("/profile", getVendorProfile);
router.post("/profile", createOrUpdateVendorProfile);
router.patch("/status", toggleVendorStatus);
router.get("/dashboard", getVendorDashboard);

router.get("/products", getVendorProducts);
router.post("/products", addProduct);
router.get(
  "/products/:productId",
  validateObjectId("productId"),
  getVendorProduct
);
router.put(
  "/products/:productId",
  validateObjectId("productId"),
  updateProduct
);
router.delete(
  "/products/:productId",
  validateObjectId("productId"),
  deleteProduct
);
router.patch(
  "/products/:productId/stock",
  validateObjectId("productId"),
  updateProductStock
);

module.exports = router;
