const Booking = require("../Models/Booking");
const Car = require("../Models/Car");
const { sendBookingConfirmationEmail, sendBookingStatusUpdateEmail } = require("../utils/emailService");
const { sendBookingConfirmationSms, sendBookingStatusUpdateSms } = require("../utils/smsService");

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { carId, pickupLocation, dropLocation, phone, pickupDate, returnDate, pickupTime, returnTime } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);

    if (pDate < today) {
      return res.status(400).json({ success: false, message: "Pickup date cannot be in the past" });
    }

    if (rDate < pDate) {
      return res.status(400).json({ success: false, message: "Return date cannot be before the pickup date" });
    }

    // Verify car exists and is available
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    if (!car.available) {
      return res.status(400).json({ success: false, message: "Car is currently not available for rent" });
    }

    // Check for double bookings (overlap of accepted or pending bookings for the same car)
    const overlapping = await Booking.findOne({
      car: carId,
      status: { $ne: "rejected" },
      pickupDate: { $lte: rDate },
      returnDate: { $gte: pDate }
    });

    if (overlapping) {
      return res.status(400).json({ 
        success: false, 
        message: "This car is already booked or requested for the selected dates. Please choose another date or car." 
      });
    }

    const booking = new Booking({
      user: req.user._id,
      car: carId,
      pickupLocation,
      dropLocation,
      phone,
      pickupDate,
      pickupTime: pickupTime || "10:00",
      returnDate,
      returnTime: returnTime || "10:00",
      status: "pending",
    });

    const createdBooking = await booking.save();

    // Send booking confirmation email asynchronously
    if (req.user && req.user.email) {
      sendBookingConfirmationEmail(req.user.email, req.user.name, createdBooking, car).catch(
        (err) => console.error("Booking confirmation email error:", err.message)
      );
    }

    // Send booking confirmation SMS asynchronously
    if (phone) {
      sendBookingConfirmationSms(phone, req.user.name, createdBooking, car).catch(
        (err) => console.error("Booking confirmation SMS error:", err.message)
      );
    }

    res.status(201).json({ success: true, booking: createdBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's own bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("car")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user", "name email")
      .populate("car")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const booking = await Booking.findById(req.params.id).populate("user").populate("car");

    if (booking) {
      booking.status = status;
      const updatedBooking = await booking.save();

      // If booking is accepted, update car availability if required
      if (status === "accepted") {
        await Car.findByIdAndUpdate(booking.car._id, { available: false });
      } else if (status === "rejected") {
        // If rejected, make sure it remains or returns to available
        await Car.findByIdAndUpdate(booking.car._id, { available: true });
      }

      // Send status update email asynchronously
      if (booking.user && booking.user.email) {
        sendBookingStatusUpdateEmail(
          booking.user.email,
          booking.user.name,
          updatedBooking,
          booking.car
        ).catch((err) => console.error("Status update email error:", err.message));
      }

      // Send status update SMS asynchronously
      if (booking.phone) {
        sendBookingStatusUpdateSms(
          booking.phone,
          booking.user.name,
          updatedBooking,
          booking.car
        ).catch((err) => console.error("Status update SMS error:", err.message));
      }

      res.json({ success: true, booking: updatedBooking });
    } else {
      res.status(404).json({ success: false, message: "Booking not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a booking (User / Admin)
// @route   POST /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("car");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Check authority
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    if (booking.cancellation && booking.cancellation.requested) {
      return res.status(400).json({ success: false, message: "Cancellation already requested" });
    }

    // Calculate Refund eligibility
    const diffTime = Math.abs(new Date(booking.returnDate) - new Date(booking.pickupDate));
    const daysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalCost = daysTotal * (booking.car?.price || 0);

    let refund = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pDate = new Date(booking.pickupDate);
    pDate.setHours(0, 0, 0, 0);

    if (pDate > today) {
      refund = totalCost; // 100% refund for future bookings
    } else if (pDate.getTime() === today.getTime()) {
      refund = Math.round(totalCost * 0.5); // 50% refund for same-day cancellation
    } else {
      refund = 0; // 0% refund if booking has already started
    }

    booking.cancellation = {
      requested: true,
      requestDate: new Date(),
      refundAmount: refund,
      refundStatus: "Initiated",
      reason: req.body.reason || "User cancelled booking",
    };

    // Release car availability if booking was accepted
    if (booking.status === "accepted" && booking.car) {
      await Car.findByIdAndUpdate(booking.car._id, { available: true });
    }

    // Mark status as rejected/cancelled
    booking.status = "rejected";
    const updatedBooking = await booking.save();

    // Send status update SMS asynchronously for cancellation
    if (updatedBooking.phone) {
      sendBookingStatusUpdateSms(
        updatedBooking.phone,
        req.user.name,
        updatedBooking,
        updatedBooking.car
      ).catch((err) => console.error("Cancellation SMS error:", err.message));
    }

    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update refund status (Admin only)
// @route   PUT /api/bookings/:id/refund
// @access  Private/Admin
const updateRefundStatus = async (req, res) => {
  try {
    const { refundStatus } = req.body; // 'Initiated', 'Processing', 'Completed'
    if (!["Initiated", "Processing", "Completed"].includes(refundStatus)) {
      return res.status(400).json({ success: false, message: "Invalid refund status" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (!booking.cancellation || !booking.cancellation.requested) {
      return res.status(400).json({ success: false, message: "No cancellation request on this booking" });
    }

    booking.cancellation.refundStatus = refundStatus;
    const updatedBooking = await booking.save();

    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  updateRefundStatus,
};
