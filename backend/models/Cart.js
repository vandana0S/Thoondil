const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product ID is required"],
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: [true, "Vendor ID is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
    max: [100, "Quantity cannot exceed 100"],
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
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
      min: [0, "Total items cannot be negative"],
    },
    subtotal: {
      type: Number,
      default: 0,
      min: [0, "Subtotal cannot be negative"],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
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

cartSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

cartSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  this.subtotal = this.items.reduce(
    (total, item) => total + item.totalPrice,
    0
  );
  next();
});

cartSchema.methods.addItem = function (productData) {
  const existingItemIndex = this.items.findIndex(
    (item) => item.productId.toString() === productData.productId.toString()
  );

  if (existingItemIndex >= 0) {
    this.items[existingItemIndex].quantity += productData.quantity;
    this.items[existingItemIndex].totalPrice =
      this.items[existingItemIndex].quantity *
      this.items[existingItemIndex].pricePerUnit;
  } else {
    this.items.push({
      productId: productData.productId,
      vendorId: productData.vendorId,
      quantity: productData.quantity,
      pricePerUnit: productData.pricePerUnit,
      totalPrice: productData.quantity * productData.pricePerUnit,
    });
  }

  return this.save();
};

cartSchema.methods.updateItemQuantity = function (productId, quantity) {
  const itemIndex = this.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = quantity;
      this.items[itemIndex].totalPrice =
        quantity * this.items[itemIndex].pricePerUnit;
    }
    return this.save();
  }
  throw new Error("Item not found in cart");
};

cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  return this.save();
};

cartSchema.methods.clearCart = function () {
  this.items = [];
  return this.save();
};

cartSchema.methods.getOrderItems = async function () {
  await this.populate({
    path: "items.productId",
    select: "name unit images",
  });

  return this.items.map((item) => ({
    productId: item.productId._id,
    productName: item.productId.name,
    productImage:
      item.productId.images && item.productId.images.length > 0
        ? item.productId.images[0]
        : "default-product.jpg",
    quantity: item.quantity,
    pricePerUnit: item.pricePerUnit,
    totalPrice: item.totalPrice,
    unit: item.productId.unit,
  }));
};

cartSchema.methods.getSummary = function () {
  return {
    totalItems: this.totalItems,
    subtotal: this.subtotal,
    itemCount: this.items.length,
    vendors: [...new Set(this.items.map((item) => item.vendorId.toString()))]
      .length,
  };
};

cartSchema.statics.findOrCreateCart = async function (userId) {
  let cart = await this.findOne({ userId }).populate(
    "items.productId",
    "name images pricePerUnit unit isAvailable stockQuantity"
  );

  if (!cart) {
    cart = new this({ userId });
    await cart.save();
  }

  return cart;
};

cartSchema.statics.validateCartItems = async function (cartId) {
  const Product = mongoose.model("Product");
  const cart = await this.findById(cartId).populate("items.productId");

  const validationResults = [];

  for (const item of cart.items) {
    const product = item.productId;

    if (!product || !product.isAvailable) {
      validationResults.push({
        productId: item.productId._id,
        issue: "Product not available",
        action: "remove",
      });
      continue;
    }

    if (item.quantity > product.stockQuantity) {
      validationResults.push({
        productId: item.productId._id,
        issue: `Only ${product.stockQuantity} items available`,
        action: "reduce_quantity",
        maxQuantity: product.stockQuantity,
      });
      continue;
    }

    if (item.pricePerUnit !== product.finalPrice) {
      validationResults.push({
        productId: item.productId._id,
        issue: "Price changed",
        action: "update_price",
        oldPrice: item.pricePerUnit,
        newPrice: product.finalPrice,
      });
    }
  }

  return validationResults;
};

module.exports = mongoose.model("Cart", cartSchema);
