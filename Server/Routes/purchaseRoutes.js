const express = require("express");
const router = express.Router();
const {
  createPurchase,
  getMyPurchases,
  getAllPurchases,
} = require("../Controllers/purchaseController");
const { protect, admin } = require("../Middleware/auth");

router.route("/")
  .post(protect, createPurchase)
  .get(protect, admin, getAllPurchases);

router.route("/my")
  .get(protect, getMyPurchases);

module.exports = router;
