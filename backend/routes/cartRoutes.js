const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  validateCart,
  getCartSummary,
  syncCartPrices,
} = require("../controllers/cartController");
const { authenticate } = require("../middlewares/auth");
const { validateObjectId } = require("../middlewares/validation");

const router = express.Router();

router.use(authenticate);

router.get("/", getCart);
router.get("/summary", getCartSummary);
router.post("/add", addToCart);
router.put("/sync-prices", syncCartPrices);
router.get("/validate", validateCart);
router.delete("/clear", clearCart);
router.put("/items/:productId", validateObjectId("productId"), updateCartItem);
router.delete(
  "/items/:productId",
  validateObjectId("productId"),
  removeFromCart
);

module.exports = router;
