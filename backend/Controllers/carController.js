const Car = require("../Models/Car");
const Booking = require("../Models/Booking");

const getCars = async (req, res) => {
  try {
    const filter = {};
    if (req.query.purpose) {
      filter.purpose = req.query.purpose;
    }
    let cars = await Car.find(filter);

    if (req.query.pickupDate && req.query.returnDate) {
      const qPickup = new Date(req.query.pickupDate);
      const qReturn = new Date(req.query.returnDate);

      // Find accepted/pending bookings overlapping with the query range
      const overlappingBookings = await Booking.find({
        status: { $ne: "rejected" },
        $or: [
          {
            pickupDate: { $lte: qReturn },
            returnDate: { $gte: qPickup }
          }
        ]
      });

      const bookedCarIds = overlappingBookings.map((b) => b.car.toString());

      cars = cars.map((car) => {
        const isBooked = bookedCarIds.includes(car._id.toString());
        let status = "Available";
        if (isBooked || !car.available) {
          status = "Booked";
        } else {
          // If there is an accepted booking in the future (within 3 days), mark it as Limited
          const hasFutureBooking = overlappingBookings.some(
            (b) => b.car.toString() === car._id.toString() && b.status === "accepted"
          );
          if (hasFutureBooking) {
            status = "Limited";
          }
        }
        return {
          ...car.toObject(),
          availabilityStatus: status,
        };
      });
    } else {
      cars = cars.map((car) => ({
        ...car.toObject(),
        availabilityStatus: car.available ? "Available" : "Booked",
      }));
    }

    res.json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new car
// @route   POST /api/cars
// @access  Private/Admin
const createCar = async (req, res) => {
  try {
    const { name, price, image, description, purpose, available } = req.body;

    const car = new Car({
      name,
      price,
      image,
      description,
      purpose: purpose || "rent",
      available: available !== undefined ? available : true,
    });

    const createdCar = await car.save();
    res.status(201).json({ success: true, car: createdCar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = async (req, res) => {
  try {
    const { name, price, image, description, purpose, available } = req.body;

    const car = await Car.findById(req.params.id);

    if (car) {
      car.name = name || car.name;
      car.price = price !== undefined ? price : car.price;
      car.image = image || car.image;
      car.description = description || car.description;
      car.purpose = purpose || car.purpose;
      car.available = available !== undefined ? available : car.available;

      const updatedCar = await car.save();
      res.json({ success: true, car: updatedCar });
    } else {
      res.status(404).json({ success: false, message: "Car not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      await car.deleteOne();
      res.json({ success: true, message: "Car removed" });
    } else {
      res.status(404).json({ success: false, message: "Car not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCars,
  createCar,
  updateCar,
  deleteCar,
};
