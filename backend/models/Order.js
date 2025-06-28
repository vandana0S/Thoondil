const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product ID is required"],
  },
  productName: {
    type: String,
    required: [true, "Product name is required"],
  },
  productImage: {
    type: String,
    required: [true, "Product image is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  pricePerUnit: {
    type: Number,
    required: [true, "Price per unit is required"],
    min: [0, "Price cannot be negative"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
    min: [0, "Total price cannot be negative"],
  },
  unit: {
    type: String,
    required: [true, "Unit is required"],
    enum: ["kg", "gram", "piece"],
  },
});

const deliveryAddressSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, "Address label is required"],
  },
  street: {
    type: String,
    required: [true, "Street address is required"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
  },
  state: {
    type: String,
    required: [true, "State is required"],
  },
  zipCode: {
    type: String,
    required: [true, "ZIP code is required"],
  },
  coordinates: {
    type: [Number],
    validate: {
      validator: function (coords) {
        return coords.length === 2;
      },
      message: "Coordinates must be [longitude, latitude]",
    },
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: [true, "Order number is required"],
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer ID is required"],
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
    },
    customerPhone: {
      type: String,
      required: [true, "Customer phone is required"],
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor ID is required"],
    },
    vendorName: {
      type: String,
      required: [true, "Vendor name is required"],
    },
    items: [orderItemSchema],
    deliveryAddress: deliveryAddressSchema,
    orderStatus: {
      type: String,
      enum: {
        values: [
          "pending",
          "confirmed",
          "preparing",
          "ready_for_delivery",
          "out_for_delivery",
          "delivered",
          "cancelled",
          "refunded",
        ],
        message: "Invalid order status",
      },
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["pending", "paid", "failed", "refunded"],
        message: "Invalid payment status",
      },
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["cash_on_delivery", "online", "wallet"],
        message: "Invalid payment method",
      },
      default: "cash_on_delivery",
    },
    paymentId: {
      type: String,
      default: null,
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, "Delivery fee cannot be negative"],
    },
    platformFee: {
      type: Number,
      default: 0,
      min: [0, "Platform fee cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    estimatedDeliveryTime: {
      type: Date,
      required: [true, "Estimated delivery time is required"],
    },
    actualDeliveryTime: {
      type: Date,
      default: null,
    },
    preparationTime: {
      type: Number,
      default: 30,
    },
    specialInstructions: {
      type: String,
      maxlength: [500, "Special instructions cannot exceed 500 characters"],
    },
    cancellationReason: {
      type: String,
      maxlength: [500, "Cancellation reason cannot exceed 500 characters"],
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          maxlength: [200, "Status note cannot exceed 200 characters"],
        },
      },
    ],
    deliveryPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deliveryPersonName: {
      type: String,
      default: null,
    },
    deliveryPersonPhone: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      default: null,
    },
    review: {
      type: String,
      maxlength: [1000, "Review cannot exceed 1000 characters"],
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ vendorId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ estimatedDeliveryTime: 1 });

orderSchema.pre("save", function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.orderNumber = `ORD-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

orderSchema.pre("save", function (next) {
  if (this.isModified("orderStatus")) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
    });
  }
  next();
});

orderSchema.virtual("orderAge").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60));
});

orderSchema.virtual("deliveryStatus").get(function () {
  const now = new Date();
  const estimated = new Date(this.estimatedDeliveryTime);

  if (this.orderStatus === "delivered") {
    return "delivered";
  } else if (this.orderStatus === "cancelled") {
    return "cancelled";
  } else if (now > estimated) {
    return "delayed";
  } else if (this.orderStatus === "out_for_delivery") {
    return "on_the_way";
  } else {
    return "processing";
  }
});

orderSchema.methods.updateStatus = function (newStatus, note = null) {
  this.orderStatus = newStatus;

  if (note) {
    this.statusHistory[this.statusHistory.length - 1].note = note;
  }

  if (newStatus === "delivered" && !this.actualDeliveryTime) {
    this.actualDeliveryTime = new Date();
  }

  return this.save();
};

orderSchema.methods.calculateTotal = function () {
  this.subtotal = this.items.reduce(
    (total, item) => total + item.totalPrice,
    0
  );
  this.totalAmount =
    this.subtotal + this.deliveryFee + this.platformFee - this.discount;
  return this.totalAmount;
};

orderSchema.methods.canBeCancelled = function () {
  const cancellableStatuses = ["pending", "confirmed"];
  return cancellableStatuses.includes(this.orderStatus);
};

orderSchema.methods.canBeModified = function () {
  const modifiableStatuses = ["pending"];
  return modifiableStatuses.includes(this.orderStatus);
};

orderSchema.methods.getSummary = function () {
  return {
    orderNumber: this.orderNumber,
    orderStatus: this.orderStatus,
    paymentStatus: this.paymentStatus,
    totalAmount: this.totalAmount,
    itemCount: this.items.length,
    totalQuantity: this.items.reduce((total, item) => total + item.quantity, 0),
    estimatedDeliveryTime: this.estimatedDeliveryTime,
    vendorName: this.vendorName,
    deliveryStatus: this.deliveryStatus,
    createdAt: this.createdAt,
  };
};

orderSchema.statics.findByCustomer = function (customerId, filters = {}) {
  const query = { customerId };

  if (filters.status) {
    query.orderStatus = filters.status;
  }

  if (filters.fromDate && filters.toDate) {
    query.createdAt = {
      $gte: new Date(filters.fromDate),
      $lte: new Date(filters.toDate),
    };
  }

  return this.find(query).sort({ createdAt: -1 });
};

orderSchema.statics.findByVendor = function (vendorId, filters = {}) {
  const query = { vendorId };

  if (filters.status) {
    query.orderStatus = filters.status;
  }

  if (filters.fromDate && filters.toDate) {
    query.createdAt = {
      $gte: new Date(filters.fromDate),
      $lte: new Date(filters.toDate),
    };
  }

  return this.find(query).sort({ createdAt: -1 });
};

orderSchema.statics.getOrderStats = function (vendorId = null, dateRange = {}) {
  const matchStage = {};

  if (vendorId) {
    matchStage.vendorId = vendorId;
  }

  if (dateRange.fromDate && dateRange.toDate) {
    matchStage.createdAt = {
      $gte: new Date(dateRange.fromDate),
      $lte: new Date(dateRange.toDate),
    };
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
        avgOrderValue: { $avg: "$totalAmount" },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0] },
        },
        confirmedOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "confirmed"] }, 1, 0] },
        },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0] },
        },
      },
    },
  ]);
};

module.exports = mongoose.model("Order", orderSchema);
