const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const { AppError, asyncHandler } = require("../middlewares/errorHandler");
const { sendSuccessResponse } = require("../utils/response");

const createOrder = asyncHandler(async (req, res, next) => {
  const { deliveryAddress, paymentMethod, specialInstructions } = req.body;

  if (!deliveryAddress) {
    return next(new AppError("Delivery address is required", 400));
  }

  const cart = await Cart.findOne({ userId: req.user._id }).populate({
    path: "items.productId",
    select: "name pricePerUnit finalPrice unit stockQuantity isAvailable",
    populate: {
      path: "vendorId",
      select: "shopName isOpen isVerified deliveryRadius deliveryFee",
    },
  });

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  const validationResults = await Cart.validateCartItems(cart._id);
  if (validationResults.length > 0) {
    return next(new AppError("Cart validation failed", 400));
  }

  const vendor = cart.items[0].productId.vendorId;
  if (!vendor.isVerified || !vendor.isOpen) {
    return next(new AppError("Vendor is not available", 400));
  }

  const orderItems = cart.items.map((item) => ({
    productId: item.productId._id,
    quantity: item.quantity,
    pricePerUnit: item.pricePerUnit,
    totalPrice: item.totalPrice,
  }));

  const subtotal = cart.getSummary().subtotal;
  const deliveryFee = vendor.deliveryFee || 0;
  const totalAmount = subtotal + deliveryFee;

  const order = await Order.create({
    customerId: req.user._id,
    vendorId: vendor._id,
    items: orderItems,
    deliveryAddress,
    paymentMethod: paymentMethod || "cash_on_delivery",
    specialInstructions,
    pricing: {
      subtotal,
      deliveryFee,
      totalAmount,
    },
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.productId._id, {
      $inc: { stockQuantity: -item.quantity },
    });
  }

  await Cart.findByIdAndDelete(cart._id);

  await order.populate([
    {
      path: "customerId",
      select: "name email phone",
    },
    {
      path: "vendorId",
      select: "shopName phone",
    },
    {
      path: "items.productId",
      select: "name unit images",
    },
  ]);

  sendSuccessResponse(res, 201, "Order created successfully", { order });
});

const getMyOrders = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { customerId: req.user._id };
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(query)
    .populate([
      {
        path: "vendorId",
        select: "shopName phone",
      },
      {
        path: "items.productId",
        select: "name unit images",
      },
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalOrders = await Order.countDocuments(query);
  const totalPages = Math.ceil(totalOrders / parseInt(limit));

  sendSuccessResponse(res, 200, "Orders retrieved successfully", {
    orders,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalOrders,
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1,
    },
  });
});

const getOrderById = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findOne({
    _id: orderId,
    customerId: req.user._id,
  }).populate([
    {
      path: "customerId",
      select: "name email phone",
    },
    {
      path: "vendorId",
      select: "shopName phone address",
    },
    {
      path: "items.productId",
      select: "name unit images description",
    },
    {
      path: "deliveryPersonId",
      select: "name phone",
    },
  ]);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  sendSuccessResponse(res, 200, "Order retrieved successfully", { order });
});

const cancelOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  const order = await Order.findOne({
    _id: orderId,
    customerId: req.user._id,
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (!["pending", "confirmed"].includes(order.status)) {
    return next(new AppError("Order cannot be cancelled at this stage", 400));
  }

  order.status = "cancelled";
  order.cancellation = {
    cancelledBy: "customer",
    reason: reason || "Cancelled by customer",
    cancelledAt: new Date(),
  };

  await order.save();

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stockQuantity: item.quantity },
    });
  }

  sendSuccessResponse(res, 200, "Order cancelled successfully", { order });
});

const getVendorOrders = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;

  const vendorProfile = await require("../models/Vendor").findOne({
    userId: req.user._id,
  });

  if (!vendorProfile) {
    return next(new AppError("Vendor profile not found", 404));
  }

  const query = { vendorId: vendorProfile._id };
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(query)
    .populate([
      {
        path: "customerId",
        select: "name email phone",
      },
      {
        path: "items.productId",
        select: "name unit images",
      },
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalOrders = await Order.countDocuments(query);
  const totalPages = Math.ceil(totalOrders / parseInt(limit));

  sendSuccessResponse(res, 200, "Vendor orders retrieved successfully", {
    orders,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalOrders,
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1,
    },
  });
});

const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { status, estimatedDeliveryTime } = req.body;

  const vendorProfile = await require("../models/Vendor").findOne({
    userId: req.user._id,
  });

  if (!vendorProfile) {
    return next(new AppError("Vendor profile not found", 404));
  }

  const order = await Order.findOne({
    _id: orderId,
    vendorId: vendorProfile._id,
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  const validStatusTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["ready_for_pickup", "cancelled"],
    ready_for_pickup: ["out_for_delivery"],
    out_for_delivery: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  if (!validStatusTransitions[order.status].includes(status)) {
    return next(new AppError("Invalid status transition", 400));
  }

  order.status = status;

  if (status === "confirmed" && estimatedDeliveryTime) {
    order.estimatedDeliveryTime = new Date(estimatedDeliveryTime);
  }

  if (status === "cancelled") {
    order.cancellation = {
      cancelledBy: "vendor",
      reason: req.body.reason || "Cancelled by vendor",
      cancelledAt: new Date(),
    };

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: item.quantity },
      });
    }
  }

  if (status === "delivered") {
    order.deliveredAt = new Date();
  }

  await order.save();

  sendSuccessResponse(res, 200, "Order status updated successfully", { order });
});

const getOrderStats = asyncHandler(async (req, res, next) => {
  const { period = "month" } = req.query;

  const customerId = req.user._id;
  let dateFilter = {};

  const now = new Date();
  if (period === "week") {
    dateFilter = {
      createdAt: {
        $gte: new Date(now.setDate(now.getDate() - 7)),
      },
    };
  } else if (period === "month") {
    dateFilter = {
      createdAt: {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    };
  } else if (period === "year") {
    dateFilter = {
      createdAt: {
        $gte: new Date(now.getFullYear(), 0, 1),
      },
    };
  }

  const stats = await Order.aggregate([
    {
      $match: {
        customerId: require("mongoose").Types.ObjectId(customerId),
        ...dateFilter,
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$pricing.totalAmount" },
        averageOrderValue: { $avg: "$pricing.totalAmount" },
        statusBreakdown: {
          $push: "$status",
        },
      },
    },
  ]);

  const statusCounts = {};
  if (stats.length > 0) {
    stats[0].statusBreakdown.forEach((status) => {
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
  }

  const result =
    stats.length > 0
      ? {
          ...stats[0],
          statusBreakdown: statusCounts,
        }
      : {
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          statusBreakdown: {},
        };

  sendSuccessResponse(res, 200, "Order statistics retrieved", {
    stats: result,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getVendorOrders,
  updateOrderStatus,
  getOrderStats,
};
