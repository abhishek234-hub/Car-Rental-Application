const SupportTicket = require("../Models/SupportTicket");

// @desc    Create support ticket
// @route   POST /api/support
// @access  Private
const createTicket = async (req, res) => {
  try {
    const { category, description } = req.body;

    if (!category || !description) {
      return res.status(400).json({ success: false, message: "Please fill in all ticket details" });
    }

    const ticket = new SupportTicket({
      user: req.user._id,
      category,
      description,
    });

    const createdTicket = await ticket.save();
    res.status(201).json({ success: true, ticket: createdTicket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user tickets
// @route   GET /api/support/my
// @access  Private
const getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all support tickets (Admin only)
// @route   GET /api/support
// @access  Private/Admin
const getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update support ticket status (Admin only)
// @route   PUT /api/support/:id
// @access  Private/Admin
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Open", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    ticket.status = status;
    const updatedTicket = await ticket.save();

    res.json({ success: true, ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
};
