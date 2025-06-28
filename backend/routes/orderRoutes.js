const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getOrderStats,
  getVendorOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { authenticate } = require("../middlewares/auth");
const { validateObjectId } = require("../middlewares/validation");

const router = express.Router();

router.use(authenticate);
router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/stats", getOrderStats);
router.get("/:orderId", validateObjectId("orderId"), getOrderById);
router.patch("/:orderId/cancel", validateObjectId("orderId"), cancelOrder);

router.get("/vendor/orders", getVendorOrders);
router.patch(
  "/vendor/:orderId/status",
  validateObjectId("orderId"),
  updateOrderStatus
);

module.exports = router;
