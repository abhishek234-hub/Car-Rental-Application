const nodemailer = require("nodemailer");

let transporter = null;

// Initialize Gmail SMTP transporter with connection pooling
const initTransporter = async () => {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT) || 587;

  if (!user || !pass) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASS is missing in environment variables."
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5,
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
    auth: {
      user,
      pass,
    },
    family: 4,
  });

  return transporter;
};

const validateEmailConfig = async () => {
  console.log("---------------------------------");
  console.log("🔍 Validating email configuration...");
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user) {
    console.error("❌ EMAIL_USER is missing in environment variables.");
    console.log("---------------------------------");
    return false;
  }
  if (!pass) {
    console.error("❌ EMAIL_PASS is missing in environment variables.");
    console.log("---------------------------------");
    return false;
  }
  if (pass.length !== 16) {
    console.warn("⚠️ Warning: EMAIL_PASS is not 16 characters. Gmail App Passwords must be exactly 16 characters.");
  }

  console.log("SMTP configuration loaded");

  try {
    const currentTransporter = await initTransporter();
    await currentTransporter.verify();
    console.log("SMTP connection verified");
    console.log("✅ Email configuration is valid and SMTP connected!");
    console.log("---------------------------------");
    return true;
  } catch (error) {
    console.error("❌ SMTP connection verification failed:");
    console.error(`Error Code: ${error.code}`);
    console.error(`Response: ${error.response}`);
    console.error(`Message: ${error.message}`);
    console.log("---------------------------------");
    return false;
  }
};

// Generic email sender
const sendMail = async ({ to, subject, text, html }) => {
  try {
    if (subject && subject.includes("OTP")) {
      console.log("Sending OTP email");
    }
    console.log(`Recipient: ${to}`);

    const currentTransporter = await initTransporter();
    const fromHeader = process.env.EMAIL_FROM || `"RentX Car Rental" <${process.env.EMAIL_USER}>`;

    const info = await currentTransporter.sendMail({
      from: fromHeader,
      to,
      subject,
      text,
      html,
    });

    if (info.rejected && info.rejected.length > 0) {
      console.error(`SMTP rejected: ${info.rejected.join(", ")}`);
      return {
        success: false,
        error: `Recipient rejected by SMTP server: ${info.rejected.join(", ")}`,
      };
    }

    console.log("=================================");
    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`SMTP accepted: ${info.messageId}`);
    console.log(`Message ID: ${info.messageId}`);
    console.log("=================================");

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("=================================");
    console.error("❌ EMAIL SENDING FAILED");
    console.error(`To: ${to}`);
    console.error(`Error: ${error.message}`);
    console.error("=================================");

    return {
      success: false,
      error: error.message,
    };
  }
};

// Welcome email
const sendWelcomeEmail = async (email, name) => {
  const subject = "Welcome to RentX Car Rental!";

  const text = `
Hello ${name},

Welcome to RentX!

Your account has been successfully created.

Best regards,
RentX Team
`;

  const html = `
<div style="font-family:Arial,sans-serif;padding:20px;color:#333;max-width:600px;margin:auto">
  <h2 style="color:#6366f1;text-align:center">
    Welcome to RentX!
  </h2>

  <p>Hello <strong>${name}</strong>,</p>

  <p>
    Your account has been successfully created on the
    RentX Car Rental platform.
  </p>

  <p>
    You can now browse our fleet and make bookings.
  </p>

  <p>
    Best regards,<br>
    <strong>RentX Team</strong>
  </p>
</div>
`;

  return sendMail({
    to: email,
    subject,
    text,
    html,
  });
};

// Booking confirmation
const sendBookingConfirmationEmail = async (
  email,
  name,
  booking,
  car
) => {
  const subject = "Booking Request Received - RentX";

  const pickupDate = new Date(
    booking.pickupDate
  ).toLocaleDateString();

  const returnDate = new Date(
    booking.returnDate
  ).toLocaleDateString();

  const text = `
Hello ${name},

Your booking request has been received.

Vehicle: ${car.name}
Pickup Location: ${booking.pickupLocation}
Pickup Date: ${pickupDate}
Pickup Time: ${booking.pickupTime || "10:00"}
Return Date: ${returnDate}
Return Time: ${booking.returnTime || "18:00"}

Status: Pending Admin Approval.

Thank you for choosing RentX!

RentX Team
`;

  const html = `
<div style="font-family:Arial,sans-serif;padding:20px;max-width:600px;margin:auto">
  <h2 style="color:#6366f1;text-align:center">
    Booking Request Received
  </h2>

  <p>Hello <strong>${name}</strong>,</p>

  <p>
    Your booking request has been received and is
    currently pending admin approval.
  </p>

  <div style="background:#f9fafb;padding:15px;border-radius:8px">
    <p><strong>Vehicle:</strong> ${car.name}</p>
    <p><strong>Pickup Location:</strong> ${booking.pickupLocation}</p>
    <p><strong>Pickup Date:</strong> ${pickupDate}</p>
    <p><strong>Pickup Time:</strong> ${booking.pickupTime || "10:00"}</p>
    <p><strong>Return Date:</strong> ${returnDate}</p>
    <p><strong>Return Time:</strong> ${booking.returnTime || "18:00"}</p>
  </div>

  <p>
    We will notify you once your booking status is updated.
  </p>

  <p>
    Best regards,<br>
    <strong>RentX Team</strong>
  </p>
</div>
`;

  return sendMail({
    to: email,
    subject,
    text,
    html,
  });
};

// Booking status update
const sendBookingStatusUpdateEmail = async (
  email,
  name,
  booking,
  car
) => {
  const isAccepted = booking.status === "accepted";

  const status = booking.status.toUpperCase();

  const subject = `Booking Request ${status} - RentX`;

  const text = `
Hello ${name},

Your booking request for ${car.name} has been ${status}.

Pickup Location: ${booking.pickupLocation}
Pickup Date: ${new Date(
    booking.pickupDate
  ).toLocaleDateString()}
Pickup Time: ${booking.pickupTime || "10:00"}

Return Date: ${new Date(
    booking.returnDate
  ).toLocaleDateString()}
Return Time: ${booking.returnTime || "18:00"}

${
  isAccepted
    ? "Your booking has been approved. Enjoy your ride!"
    : "Unfortunately, your booking was rejected. Please try another vehicle."
}

Best regards,
RentX Team
`;

  const html = `
<div style="font-family:Arial,sans-serif;padding:20px;max-width:600px;margin:auto">

  <h2 style="
    color:${isAccepted ? "#10b981" : "#ef4444"};
    text-align:center
  ">
    Booking ${status}
  </h2>

  <p>Hello <strong>${name}</strong>,</p>

  <p>
    Your booking request for
    <strong>${car.name}</strong>
    has been <strong>${status}</strong>.
  </p>

  <div style="background:#f9fafb;padding:15px;border-radius:8px">
    <p><strong>Vehicle:</strong> ${car.name}</p>

    <p>
      <strong>Pickup Location:</strong>
      ${booking.pickupLocation}
    </p>

    <p>
      <strong>Pickup Date:</strong>
      ${new Date(booking.pickupDate).toLocaleDateString()}
    </p>

    <p>
      <strong>Pickup Time:</strong>
      ${booking.pickupTime || "10:00"}
    </p>

    <p>
      <strong>Return Date:</strong>
      ${new Date(booking.returnDate).toLocaleDateString()}
    </p>

    <p>
      <strong>Return Time:</strong>
      ${booking.returnTime || "18:00"}
    </p>

    <p>
      <strong>Status:</strong> ${status}
    </p>
  </div>

  <p>
    ${
      isAccepted
        ? "Great! Your booking has been approved. Enjoy your ride!"
        : "We are sorry we could not accommodate your booking."
    }
  </p>

  <p>
    Best regards,<br>
    <strong>RentX Team</strong>
  </p>

</div>
`;

  return sendMail({
    to: email,
    subject,
    text,
    html,
  });
};

// Purchase receipt
const sendPurchaseReceiptEmail = async (
  email,
  name,
  purchase,
  car
) => {
  const subject =
    "Purchase Confirmation Invoice - RentX Marketplace";

  const price = Number(purchase.price || 0).toLocaleString();

  const invoiceId = purchase._id;

  const text = `
Hello ${name},

Congratulations!

You have purchased ${car.name} from RentX Marketplace.

Purchase Amount: ₹${price}
Invoice ID: ${invoiceId}

Your purchase has been confirmed.

Best regards,
RentX Team
`;

  const html = `
<div style="font-family:Arial,sans-serif;padding:20px;max-width:600px;margin:auto">

  <h2 style="color:#8b5cf6;text-align:center">
    Purchase Confirmation
  </h2>

  <p>Hello <strong>${name}</strong>,</p>

  <p>
    Congratulations! Your purchase has been completed successfully.
  </p>

  <div style="background:#f9fafb;padding:15px;border-radius:8px">

    <p>
      <strong>Invoice ID:</strong>
      ${invoiceId}
    </p>

    <p>
      <strong>Vehicle:</strong>
      ${car.name}
    </p>

    <p>
      <strong>Total Cost:</strong>
      ₹${price}
    </p>

    <p>
      <strong>Status:</strong>
      PAID
    </p>

  </div>

  <p>
    Best regards,<br>
    <strong>RentX Team</strong>
  </p>

</div>
`;

  const userResult = await sendMail({
    to: email,
    subject,
    text,
    html,
  });

  // Admin notification
  const adminEmail = process.env.EMAIL_USER;

  if (adminEmail) {
    await sendMail({
      to: adminEmail,
      subject: `🚨 Car Sold: ${car.name}`,
      text: `
A vehicle has been purchased.

Buyer:
${name}

Email:
${email}

Vehicle:
${car.name}

Price:
₹${price}

Invoice:
${invoiceId}
`,
      html: `
<div style="font-family:Arial,sans-serif;padding:20px">
  <h2>🚨 Car Sold</h2>

  <p><strong>Buyer:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Vehicle:</strong> ${car.name}</p>
  <p><strong>Price:</strong> ₹${price}</p>
  <p><strong>Invoice:</strong> ${invoiceId}</p>
</div>
`,
    });
  }

  return userResult;
};

// Contact form
const sendContactFormEmail = async ({
  name,
  email,
  message,
}) => {
  const adminEmail = process.env.EMAIL_USER;

  if (!adminEmail) {
    return {
      success: false,
      error: "EMAIL_USER is not configured.",
    };
  }

  // Send to admin
  await sendMail({
    to: adminEmail,
    subject: `New Contact Form Inquiry - ${name}`,
    text: `
New contact form message.

Name: ${name}
Email: ${email}

Message:
${message}
`,
    html: `
<div style="font-family:Arial,sans-serif;padding:20px">

  <h2>New Contact Support Message</h2>

  <p>
    <strong>Name:</strong> ${name}
  </p>

  <p>
    <strong>Email:</strong> ${email}
  </p>

  <p>
    <strong>Message:</strong>
  </p>

  <div style="background:#f9fafb;padding:15px">
    ${message.replace(/\n/g, "<br>")}
  </div>

</div>
`,
  });

  // Send confirmation to customer
  return sendMail({
    to: email,
    subject: "We received your message! - RentX Support",
    text: `
Hello ${name},

Thank you for contacting RentX.

We have received your message and our support team will get back to you shortly.

Your message:
${message}

Best regards,
RentX Support Team
`,
    html: `
<div style="font-family:Arial,sans-serif;padding:20px">

  <h2 style="color:#6366f1">
    Thank You for Reaching Out!
  </h2>

  <p>Hello <strong>${name}</strong>,</p>

  <p>
    We have successfully received your inquiry.
    Our support team will get back to you shortly.
  </p>

  <p>
    Best regards,<br>
    <strong>RentX Support Team</strong>
  </p>

</div>
`,
  });
};

// ⭐ OTP EMAIL
const sendOtpEmail = async (email, otp) => {
  const subject = "Your OTP Verification Code - RentX";

  const text = `
Your RentX OTP verification code is:

${otp}

This OTP is valid for 5 minutes.

If you did not request this OTP, please ignore this email.

RentX Team
`;

  const html = `
<div style="
  font-family:Arial,sans-serif;
  padding:30px;
  max-width:600px;
  margin:auto;
  background:#ffffff;
  border:1px solid #e5e7eb;
  border-radius:12px;
">

  <h2 style="
    color:#6366f1;
    text-align:center;
  ">
    Verify Your RentX Account
  </h2>

  <p>
    Hello,
  </p>

  <p>
    Use the following OTP to verify your email address:
  </p>

  <div style="
    text-align:center;
    margin:30px 0;
  ">

    <span style="
      display:inline-block;
      background:#f3f4f6;
      border:2px dashed #6366f1;
      color:#312e81;
      padding:15px 30px;
      font-size:32px;
      font-weight:900;
      letter-spacing:6px;
      border-radius:8px;
    ">
      ${otp}
    </span>

  </div>

  <p style="
    color:#ef4444;
    font-weight:bold;
    text-align:center;
  ">
    This OTP is valid for 5 minutes only.
  </p>

  <p>
    If you did not request this OTP, you can safely ignore this email.
  </p>

  <p>
    Best regards,<br>
    <strong>RentX Team</strong>
  </p>

</div>
`;

  return sendMail({
    to: email,
    subject,
    text,
    html,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
  sendPurchaseReceiptEmail,
  sendContactFormEmail,
  sendOtpEmail,
  validateEmailConfig,
};