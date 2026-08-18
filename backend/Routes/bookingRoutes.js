const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  updateRefundStatus,
} = require("../Controllers/bookingController");
const { protect, admin } = require("../Middleware/auth");

router.route("/")
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.route("/my")
  .get(protect, getMyBookings);

router.route("/:id")
  .put(protect, admin, updateBookingStatus);

router.route("/:id/cancel")
  .post(protect, cancelBooking);

router.route("/:id/refund")
  .put(protect, admin, updateRefundStatus);

module.exports = router;
