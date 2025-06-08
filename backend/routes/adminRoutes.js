const express = require("express");
const {
  getAllVendors,
  getVendorDetails,
  verifyVendor,
  getAdminDashboard,
  getAllUsers,
  toggleUserStatus,
} = require("../controllers/adminController");
const { authenticate, authorize } = require("../middlewares/auth");
const { validateObjectId } = require("../middlewares/validation");

const router = express.Router();

router.use(authenticate);
router.use(authorize("admin"));

router.get("/dashboard", getAdminDashboard);
router.get("/vendors", getAllVendors);
router.get(
  "/vendors/:vendorId",
  validateObjectId("vendorId"),
  getVendorDetails
);
router.put(
  "/vendors/:vendorId/verify",
  validateObjectId("vendorId"),
  verifyVendor
);
router.get("/users", getAllUsers);
router.patch(
  "/users/:userId/status",
  validateObjectId("userId"),
  toggleUserStatus
);

module.exports = router;
