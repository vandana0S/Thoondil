const express = require("express");
const {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddress,
} = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");
const {
  validateProfileUpdate,
  validateAddress,
  validateObjectId,
} = require("../middlewares/validation");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router
  .route("/me/profile")
  .get(getProfile)
  .put(validateProfileUpdate, updateProfile);

// Address routes
router
  .route("/me/addresses")
  .get(getAddresses)
  .post(validateAddress, addAddress);

router
  .route("/me/addresses/:addressId")
  .get(validateObjectId("addressId"), getAddress)
  .put(validateObjectId("addressId"), validateAddress, updateAddress)
  .delete(validateObjectId("addressId"), deleteAddress);

module.exports = router;
