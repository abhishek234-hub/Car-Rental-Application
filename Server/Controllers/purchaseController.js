const Purchase = require("../Models/Purchase");
const Car = require("../Models/Car");
const { sendPurchaseReceiptEmail } = require("../utils/emailService");

// @desc    Create a new purchase (Buy a car)
// @route   POST /api/purchases
// @access  Private
const createPurchase = async (req, res) => {
  try {
    const { carId, price } = req.body;

    if (!carId || !price) {
      return res.status(400).json({ success: false, message: "Car ID and price are required" });
    }

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    if (car.purpose !== "sale") {
      return res.status(400).json({ success: false, message: "Car is not listed for sale" });
    }

    if (!car.available) {
      return res.status(400).json({ success: false, message: "Car is already sold" });
    }

    // Mark car as sold (unavailable)
    car.available = false;
    await car.save();

    // Create purchase record
    const purchase = new Purchase({
      user: req.user._id,
      car: carId,
      price: price,
    });

    const createdPurchase = await purchase.save();
    
    // Send purchase receipt email asynchronously
    if (req.user && req.user.email) {
      sendPurchaseReceiptEmail(req.user.email, req.user.name, createdPurchase, car).catch(
        (err) => console.error("Purchase receipt email error:", err.message)
      );
    }
    
    res.status(201).json({
      success: true,
      message: "Car purchased successfully",
      purchase: createdPurchase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's purchases
// @route   GET /api/purchases/my
// @access  Private
const getMyPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id })
      .populate("car")
      .sort("-createdAt");

    res.json({ success: true, purchases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all purchases (Admin only)
// @route   GET /api/purchases
// @access  Private/Admin
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({})
      .populate("car")
      .populate("user", "name email")
      .sort("-createdAt");

    res.json({ success: true, purchases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPurchase,
  getMyPurchases,
  getAllPurchases,
};
