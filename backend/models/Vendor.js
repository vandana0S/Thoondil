const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required"],
      unique: true,
    },
    shopName: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
      minlength: [2, "Shop name must be at least 2 characters long"],
      maxlength: [100, "Shop name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Shop description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    shopAddress: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, "ZIP code is required"],
        trim: true,
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, "Location coordinates are required"],
        validate: {
          validator: function (coords) {
            return (
              coords.length === 2 &&
              coords[0] >= -180 &&
              coords[0] <= 180 && // longitude
              coords[1] >= -90 &&
              coords[1] <= 90 // latitude
            );
          },
          message: "Invalid coordinates format",
        },
      },
    },
    pincodesServed: {
      type: [String],
      required: [true, "At least one pincode must be served"],
      validate: {
        validator: function (pincodes) {
          return (
            pincodes.length > 0 && pincodes.every((pin) => /^\d{6}$/.test(pin))
          );
        },
        message: "Invalid pincode format. Must be 6 digits.",
      },
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
    isOpen: {
      type: Boolean,
      default: true,
    },
    openingTime: {
      type: String,
      required: [true, "Opening time is required"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (HH:MM)",
      ],
    },
    closingTime: {
      type: String,
      required: [true, "Closing time is required"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (HH:MM)",
      ],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    businessLicense: {
      type: String, // URL to license document
      default: null,
    },
    phoneNumber: {
      type: String,
      required: [true, "Business phone number is required"],
      match: [/^[+]?[\d\s\-\(\)]{10,15}$/, "Please enter a valid phone number"],
    },
    totalOrders: {
      type: Number,
      default: 0,
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

// Create geospatial index for location-based queries
vendorSchema.index({ location: "2dsphere" });
vendorSchema.index({ isVerified: 1, isOpen: 1 });
vendorSchema.index({ pincodesServed: 1 });

// Virtual for public profile
vendorSchema.virtual("publicProfile").get(function () {
  return {
    _id: this._id,
    shopName: this.shopName,
    description: this.description,
    shopAddress: this.shopAddress,
    location: this.location,
    averageRating: this.averageRating,
    totalRatings: this.totalRatings,
    isOpen: this.isOpen,
    openingTime: this.openingTime,
    closingTime: this.closingTime,
    phoneNumber: this.phoneNumber,
    totalOrders: this.totalOrders,
    createdAt: this.createdAt,
  };
});

// Instance method to check if vendor serves a pincode
vendorSchema.methods.servesPincode = function (pincode) {
  return this.pincodesServed.includes(pincode);
};

// Instance method to check if vendor is currently open
vendorSchema.methods.isCurrentlyOpen = function () {
  if (!this.isOpen) return false;

  const now = new Date();
  const currentTime =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  return currentTime >= this.openingTime && currentTime <= this.closingTime;
};

// Static method to find vendors near location
vendorSchema.statics.findNearLocation = function (
  longitude,
  latitude,
  maxDistance = 10000
) {
  return this.find({
    isVerified: true,
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance, // in meters
      },
    },
  });
};

// Static method to find verified vendors
vendorSchema.statics.findVerified = function () {
  return this.find({ isVerified: true });
};

module.exports = mongoose.model("Vendor", vendorSchema);
