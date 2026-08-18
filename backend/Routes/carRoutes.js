const express = require("express");
const router = express.Router();
const {
  getCars,
  createCar,
  updateCar,
  deleteCar,
} = require("../Controllers/carController");
const { protect, admin } = require("../Middleware/auth");

router.route("/")
  .get(getCars)
  .post(protect, admin, createCar);

router.route("/:id")
  .put(protect, admin, updateCar)
  .delete(protect, admin, deleteCar);

module.exports = router;
