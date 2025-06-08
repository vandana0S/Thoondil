const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters long"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    images: {
      type: [String],
      validate: {
        validator: function (images) {
          return images.length > 0 && images.length <= 5;
        },
        message: "Product must have 1-5 images",
      },
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: {
        values: [
          "Sea Fish",
          "River Fish",
          "Shellfish",
          "Prawns",
          "Crabs",
          "Lobster",
          "Dried Fish",
          "Fish Curry Cut",
          "Fish Steaks",
          "Other Seafood",
        ],
        message: "Invalid product category",
      },
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor ID is required"],
    },
    pricePerUnit: {
      type: Number,
      required: [true, "Price per unit is required"],
      min: [0.01, "Price must be greater than 0"],
      max: [10000, "Price cannot exceed ₹10,000 per unit"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: {
        values: ["kg", "gram", "piece"],
        message: "Unit must be kg, gram, or piece",
      },
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      max: [10000, "Stock quantity cannot exceed 10,000"],
    },
    minOrderQuantity: {
      type: Number,
      default: 1,
      min: [1, "Minimum order quantity must be at least 1"],
    },
    maxOrderQuantity: {
      type: Number,
      default: 100,
      validate: {
        validator: function (value) {
          return value >= this.minOrderQuantity;
        },
        message:
          "Maximum order quantity must be greater than minimum order quantity",
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalSold: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      validate: {
        validator: function (tags) {
          return tags.length <= 10;
        },
        message: "Cannot have more than 10 tags",
      },
    },
    nutritionalInfo: {
      protein: {
        type: Number,
        min: [0, "Protein content cannot be negative"],
      },
      fat: {
        type: Number,
        min: [0, "Fat content cannot be negative"],
      },
      carbs: {
        type: Number,
        min: [0, "Carbohydrate content cannot be negative"],
      },
      calories: {
        type: Number,
        min: [0, "Calorie content cannot be negative"],
      },
    },
    preparationTime: {
      type: Number, // in minutes
      default: 30,
      min: [1, "Preparation time must be at least 1 minute"],
      max: [1440, "Preparation time cannot exceed 24 hours"],
    },
    shelfLife: {
      type: Number, // in hours
      default: 24,
      min: [1, "Shelf life must be at least 1 hour"],
      max: [168, "Shelf life cannot exceed 1 week"],
    },
    isDiscounted: {
      type: Boolean,
      default: false,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [90, "Discount cannot exceed 90%"],
    },
    discountValidUntil: {
      type: Date,
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

// Indexes for efficient queries
productSchema.index({ vendorId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isAvailable: 1 });
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ averageRating: -1 });
productSchema.index({ totalSold: -1 });
productSchema.index({ createdAt: -1 });

// Virtual for discounted price
productSchema.virtual("discountedPrice").get(function () {
  if (this.isDiscounted && this.discountPercentage > 0) {
    return this.pricePerUnit * (1 - this.discountPercentage / 100);
  }
  return this.pricePerUnit;
});

// Virtual for final price (considering discount and validity)
productSchema.virtual("finalPrice").get(function () {
  if (
    this.isDiscounted &&
    this.discountPercentage > 0 &&
    (!this.discountValidUntil || new Date() <= this.discountValidUntil)
  ) {
    return this.pricePerUnit * (1 - this.discountPercentage / 100);
  }
  return this.pricePerUnit;
});

// Instance method to check if product is in stock
productSchema.methods.isInStock = function (quantity = 1) {
  return this.isAvailable && this.stockQuantity >= quantity;
};

// Instance method to check if quantity is within order limits
productSchema.methods.isValidOrderQuantity = function (quantity) {
  return quantity >= this.minOrderQuantity && quantity <= this.maxOrderQuantity;
};

// Instance method to reduce stock
productSchema.methods.reduceStock = function (quantity) {
  if (this.stockQuantity >= quantity) {
    this.stockQuantity -= quantity;
    this.totalSold += quantity;

    // Auto-disable if out of stock
    if (this.stockQuantity === 0) {
      this.isAvailable = false;
    }

    return this.save();
  }
  throw new Error("Insufficient stock");
};

// Instance method to get public info
productSchema.methods.getPublicInfo = function () {
  return {
    _id: this._id,
    name: this.name,
    description: this.description,
    images: this.images,
    category: this.category,
    vendorId: this.vendorId,
    pricePerUnit: this.pricePerUnit,
    finalPrice: this.finalPrice,
    unit: this.unit,
    isAvailable: this.isAvailable,
    averageRating: this.averageRating,
    totalRatings: this.totalRatings,
    totalSold: this.totalSold,
    tags: this.tags,
    nutritionalInfo: this.nutritionalInfo,
    preparationTime: this.preparationTime,
    shelfLife: this.shelfLife,
    isDiscounted: this.isDiscounted,
    discountPercentage: this.discountPercentage,
    discountValidUntil: this.discountValidUntil,
    minOrderQuantity: this.minOrderQuantity,
    maxOrderQuantity: this.maxOrderQuantity,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Static method to find available products
productSchema.statics.findAvailable = function () {
  return this.find({ isAvailable: true, stockQuantity: { $gt: 0 } });
};

// Static method to find products by category
productSchema.statics.findByCategory = function (category) {
  return this.find({ category, isAvailable: true, stockQuantity: { $gt: 0 } });
};

// Static method to search products
productSchema.statics.searchProducts = function (searchTerm, filters = {}) {
  const query = { isAvailable: true, stockQuantity: { $gt: 0 } };

  // Add text search if search term provided
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }

  // Add category filter
  if (filters.category) {
    query.category = filters.category;
  }

  // Add price range filter
  if (filters.minPrice || filters.maxPrice) {
    query.pricePerUnit = {};
    if (filters.minPrice) query.pricePerUnit.$gte = filters.minPrice;
    if (filters.maxPrice) query.pricePerUnit.$lte = filters.maxPrice;
  }

  // Add vendor filter
  if (filters.vendorId) {
    query.vendorId = filters.vendorId;
  }

  return this.find(query);
};

module.exports = mongoose.model("Product", productSchema);
