const express = require("express");
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
} = require("../Controllers/supportController");
const { protect, admin } = require("../Middleware/auth");

router.route("/")
  .post(protect, createTicket)
  .get(protect, admin, getAllTickets);

router.route("/my")
  .get(protect, getMyTickets);

router.route("/:id")
  .put(protect, admin, updateTicketStatus);

module.exports = router;
