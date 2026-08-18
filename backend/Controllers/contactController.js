const { sendContactFormEmail } = require("../utils/emailService");

// @desc    Submit a contact support query
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    // Send emails asynchronously
    sendContactFormEmail({ name, email, message }).catch((err) =>
      console.error("Contact form email error:", err.message)
    );

    res.json({
      success: true,
      message: "Message received. We have sent a confirmation email to you.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitContactForm,
};
