const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    pickupLocation: {
      type: String,
      required: [true, "Pickup location is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required for booking alerts"],
    },
    dropLocation: {
      type: String,
      required: [true, "Dropoff location is required"],
    },
    pickupDate: {
      type: Date,
      required: [true, "Pickup date is required"],
    },
    pickupTime: {
      type: String,
      default: "10:00",
    },
    returnDate: {
      type: Date,
      required: [true, "Return date is required"],
    },
    returnTime: {
      type: String,
      default: "10:00",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    cancellation: {
      requested: { type: Boolean, default: false },
      requestDate: Date,
      refundAmount: { type: Number, default: 0 },
      refundStatus: { 
        type: String, 
        enum: ["Initiated", "Processing", "Completed"], 
        default: "Initiated" 
      },
      reason: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
