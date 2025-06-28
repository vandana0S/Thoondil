const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const { AppError, asyncHandler } = require("../middlewares/errorHandler");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");

// Get user's cart
const getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOrCreateCart(req.user._id);

  // Populate product details
  await cart.populate({
    path: "items.productId",
    select:
      "name images pricePerUnit finalPrice unit isAvailable stockQuantity minOrderQuantity maxOrderQuantity",
    populate: {
      path: "vendorId",
      select: "shopName isOpen isVerified",
    },
  });

  // Validate cart items
  const validationResults = await Cart.validateCartItems(cart._id);

  sendSuccessResponse(res, 200, "Cart retrieved successfully", {
    cart,
    summary: cart.getSummary(),
    validationIssues: validationResults,
  });
});

// Add item to cart
const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return next(new AppError("Product ID is required", 400));
  }

  // Validate product
  const product = await Product.findById(productId).populate("vendorId");
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (!product.isAvailable) {
    return next(new AppError("Product is not available", 400));
  }

  if (!product.isInStock(quantity)) {
    return next(
      new AppError(`Only ${product.stockQuantity} items available`, 400)
    );
  }

  if (!product.isValidOrderQuantity(quantity)) {
    return next(
      new AppError(
        `Order quantity must be between ${product.minOrderQuantity} and ${product.maxOrderQuantity}`,
        400
      )
    );
  }

  // Check if vendor is open and verified
  const vendor = product.vendorId;
  if (!vendor.isVerified) {
    return next(new AppError("Vendor is not verified", 400));
  }

  if (!vendor.isOpen) {
    return next(new AppError("Vendor is currently closed", 400));
  }

  // Get or create cart
  const cart = await Cart.findOrCreateCart(req.user._id);

  // Check if cart has items from different vendors
  if (cart.items.length > 0) {
    const existingVendorId = cart.items[0].vendorId.toString();
    if (existingVendorId !== vendor._id.toString()) {
      return next(
        new AppError(
          "Cannot add items from different vendors. Please clear cart first.",
          400
        )
      );
    }
  }

  // Add item to cart
  await cart.addItem({
    productId: product._id,
    vendorId: vendor._id,
    quantity,
    pricePerUnit: product.finalPrice,
  });

  // Populate and return updated cart
  await cart.populate({
    path: "items.productId",
    select:
      "name images pricePerUnit finalPrice unit isAvailable stockQuantity",
  });

  sendSuccessResponse(res, 200, "Item added to cart successfully", {
    cart,
    summary: cart.getSummary(),
  });
});

// Update item quantity in cart
const updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 0) {
    return next(new AppError("Valid quantity is required", 400));
  }

  // Get cart
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  // Find the item in cart
  const cartItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (!cartItem) {
    return next(new AppError("Item not found in cart", 404));
  }

  // Validate against current product data
  const product = await Product.findById(productId);
  if (!product || !product.isAvailable) {
    return next(new AppError("Product is no longer available", 400));
  }

  if (quantity > 0) {
    if (!product.isInStock(quantity)) {
      return next(
        new AppError(`Only ${product.stockQuantity} items available`, 400)
      );
    }

    if (!product.isValidOrderQuantity(quantity)) {
      return next(
        new AppError(
          `Order quantity must be between ${product.minOrderQuantity} and ${product.maxOrderQuantity}`,
          400
        )
      );
    }
  }

  // Update quantity
  await cart.updateItemQuantity(productId, quantity);

  // Populate and return updated cart
  await cart.populate({
    path: "items.productId",
    select:
      "name images pricePerUnit finalPrice unit isAvailable stockQuantity",
  });

  const message =
    quantity === 0 ? "Item removed from cart" : "Cart updated successfully";

  sendSuccessResponse(res, 200, message, {
    cart,
    summary: cart.getSummary(),
  });
});

// Remove item from cart
const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  // Get cart
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  // Remove item
  await cart.removeItem(productId);

  // Populate and return updated cart
  await cart.populate({
    path: "items.productId",
    select:
      "name images pricePerUnit finalPrice unit isAvailable stockQuantity",
  });

  sendSuccessResponse(res, 200, "Item removed from cart successfully", {
    cart,
    summary: cart.getSummary(),
  });
});

// Clear entire cart
const clearCart = asyncHandler(async (req, res, next) => {
  // Get cart
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  // Clear cart
  await cart.clearCart();

  sendSuccessResponse(res, 200, "Cart cleared successfully", {
    cart,
    summary: cart.getSummary(),
  });
});

// Validate cart before checkout
const validateCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate({
    path: "items.productId",
    select:
      "name images pricePerUnit finalPrice unit isAvailable stockQuantity minOrderQuantity maxOrderQuantity",
    populate: {
      path: "vendorId",
      select: "shopName isOpen isVerified",
    },
  });

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  // Validate each item
  const validationResults = await Cart.validateCartItems(cart._id);
  const hasIssues = validationResults.length > 0;

  // Check vendor availability
  const vendor = cart.items[0].productId.vendorId;
  if (!vendor.isVerified || !vendor.isOpen) {
    validationResults.push({
      issue: "Vendor is not available",
      action: "vendor_unavailable",
    });
  }

  sendSuccessResponse(res, 200, "Cart validation completed", {
    cart,
    summary: cart.getSummary(),
    isValid: !hasIssues,
    validationIssues: validationResults,
  });
});

// Get cart summary
const getCartSummary = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    return sendSuccessResponse(res, 200, "Cart summary retrieved", {
      summary: { totalItems: 0, subtotal: 0, itemCount: 0, vendors: 0 },
    });
  }

  sendSuccessResponse(res, 200, "Cart summary retrieved", {
    summary: cart.getSummary(),
  });
});

// Sync cart with current product prices
const syncCartPrices = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user._id });

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  let priceUpdated = false;

  // Update prices for each item
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);

    if (product && product.finalPrice !== item.pricePerUnit) {
      item.pricePerUnit = product.finalPrice;
      item.totalPrice = item.quantity * product.finalPrice;
      priceUpdated = true;
    }
  }

  if (priceUpdated) {
    await cart.save();
  }

  // Populate and return cart
  await cart.populate({
    path: "items.productId",
    select:
      "name images pricePerUnit finalPrice unit isAvailable stockQuantity",
  });

  sendSuccessResponse(
    res,
    200,
    priceUpdated ? "Cart prices updated" : "Cart prices are current",
    {
      cart,
      summary: cart.getSummary(),
      priceUpdated,
    }
  );
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  validateCart,
  getCartSummary,
  syncCartPrices,
};
