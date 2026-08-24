const nodemailer = require("nodemailer");

// Initialize transporter variable
let transporter = null;

const initTransporter = async () => {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.EMAIL_PORT) || 587;

  if (user && pass && user !== "abmishra056@gmail.com" && pass !== "heruhlosoajmqvra") {
    console.log("Using SMTP credentials from environment variables for email sending.");
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
      family: 4, // Force IPv4 to avoid IPv6 ENETUNREACH errors
    });
  } else {
    console.log("No valid EMAIL_USER and EMAIL_PASS found in environment or invalid Gmail App Password.");
    console.log("Falling back directly to mock console mailer...");
    transporter = {
      sendMail: async (options) => {
        console.log("\n================ MOCK EMAIL SENT ================");
        console.log(`FROM: ${options.from}`);
        console.log(`TO: ${options.to}`);
        console.log(`SUBJECT: ${options.subject}`);
        console.log("------------------ BODY ------------------");
        console.log(options.text || options.html);
        console.log("=================================================\n");
        return { messageId: "mock-id-" + Math.random().toString(36).slice(2) };
      }
    };
  }
  return transporter;
};

// Helper function to send email
const sendMail = async ({ to, subject, text, html }) => {
  try {
    const currentTransporter = await initTransporter();
    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || '"RentX Car Rental" <no-reply@rentx.com>';
    
    const info = await currentTransporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent: ${info.messageId}`);
    
    // If it's an Ethereal account, log the URL to view the message
    if (nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`Preview URL: ${previewUrl}`);
      }
    }
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error.message);
    return { success: false, error: error.message };
  }
};

// Send welcome email on registration
const sendWelcomeEmail = async (email, name) => {
  const subject = "Welcome to RentX Car Rental!";
  const text = `Hello ${name},\n\nWelcome to RentX! Your account has been successfully created. Explore our fleet and rent your favorite ride today!\n\nBest regards,\nRentX Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #6366f1; text-align: center;">Welcome to RentX!</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your account has been successfully created on the RentX Car Rental platform.</p>
      <p>You can now log in, browse our premium fleet of everyday hatchbacks, SUVs, and luxury sedans, and make bookings in just under 2 minutes.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:5173/login" style="background-color: #6366f1; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Dashboard</a>
      </div>
      <p>Best regards,<br/><strong>RentX Team</strong></p>
    </div>
  `;
  return sendMail({ to: email, subject, text, html });
};

// Send booking confirmation request email
const sendBookingConfirmationEmail = async (email, name, booking, car) => {
  const subject = "Booking Request Received - RentX";
  const text = `Hello ${name},\n\nWe have received your booking request for ${car.name}.\nPickup Location: ${booking.pickupLocation}\nPickup Date/Time: ${new Date(booking.pickupDate).toLocaleDateString()} at ${booking.pickupTime || "10:00"}\nReturn Date/Time: ${new Date(booking.returnDate).toLocaleDateString()} at ${booking.returnTime || "18:00"}\nStatus: Pending Admin Approval.\n\nThank you for choosing RentX!`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #6366f1; text-align: center;">Booking Request Received</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Thank you for placing a rental request with RentX. Your booking is currently **Pending Approval** from our administrator team.</p>
      
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">Booking Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold; width: 35%;">Vehicle:</td>
            <td style="padding: 5px 0; font-weight: bold;">${car.name}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Pickup Location:</td>
            <td style="padding: 5px 0;">${booking.pickupLocation}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Pickup Date/Time:</td>
            <td style="padding: 5px 0;">${new Date(booking.pickupDate).toLocaleDateString()} at ${booking.pickupTime || "10:00"}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Return Date/Time:</td>
            <td style="padding: 5px 0;">${new Date(booking.returnDate).toLocaleDateString()} at ${booking.returnTime || "18:00"}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Daily Rent:</td>
            <td style="padding: 5px 0; color: #4f46e5; font-weight: bold;">₹${car.price.toLocaleString()}/day</td>
          </tr>
        </table>
      </div>
      
      <p>We will notify you by email as soon as your booking status is updated by the administrator.</p>
      <p>Best regards,<br/><strong>RentX Team</strong></p>
    </div>
  `;
  return sendMail({ to: email, subject, text, html });
};

// Send booking status update (Accept/Reject)
const sendBookingStatusUpdateEmail = async (email, name, booking, car) => {
  const isAccepted = booking.status === "accepted";
  const subject = `Booking Request ${isAccepted ? "APPROVED" : "REJECTED"} - RentX`;
  
  const text = `Hello ${name},\n\nYour booking request for ${car.name} has been ${booking.status.toUpperCase()}.\nPickup Location: ${booking.pickupLocation}\nPickup Date/Time: ${new Date(booking.pickupDate).toLocaleDateString()} at ${booking.pickupTime || "10:00"}\nReturn Date/Time: ${new Date(booking.returnDate).toLocaleDateString()} at ${booking.returnTime || "18:00"}\n\n${isAccepted ? "Enjoy your ride! Please visit your dashboard to track details." : "Please try booking another vehicle from our fleet."}\n\nBest regards,\nRentX Team`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: ${isAccepted ? "#10b981" : "#ef4444"}; text-align: center;">Booking ${booking.status.toUpperCase()}</h2>
      <p>Hello <strong>${name}</strong>,</p>
      
      <p>Your booking request for the vehicle <strong>${car.name}</strong> has been <strong>${booking.status.toUpperCase()}</strong> by the admin.</p>
      
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold; width: 35%;">Vehicle:</td>
            <td style="padding: 5px 0; font-weight: bold;">${car.name}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Pickup Location:</td>
            <td style="padding: 5px 0;">${booking.pickupLocation}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Pickup Date/Time:</td>
            <td style="padding: 5px 0;">${new Date(booking.pickupDate).toLocaleDateString()} at ${booking.pickupTime || "10:00"}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Return Date/Time:</td>
            <td style="padding: 5px 0;">${new Date(booking.returnDate).toLocaleDateString()} at ${booking.returnTime || "18:00"}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Status:</td>
            <td style="padding: 5px 0; color: ${isAccepted ? "#10b981" : "#ef4444"}; font-weight: bold; text-transform: uppercase;">${booking.status}</td>
          </tr>
        </table>
      </div>
      
      ${isAccepted ? `
        <p style="color: #1f2937; font-weight: bold;">Great! You can now track your ride directly from your user dashboard using our simulated GPS map.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="http://localhost:5173/dashboard" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
        </div>
      ` : `
        <p>We are sorry we could not accommodate your booking this time. Please browse our dashboard to check other available cars.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="http://localhost:5173/cars" style="background-color: #ef4444; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Browse Fleet</a>
        </div>
      `}
      
      <p>Best regards,<br/><strong>RentX Team</strong></p>
    </div>
  `;
  return sendMail({ to: email, subject, text, html });
};

// Send purchase receipt
const sendPurchaseReceiptEmail = async (email, name, purchase, car) => {
  const subject = "Purchase Confirmation Invoice - RentX Marketplace";
  const text = `Hello ${name},\n\nCongratulations! You have purchased the car ${car.name} from the RentX Marketplace.\nPurchase Amount: ₹${purchase.price.toLocaleString()}\nInvoice ID: ${purchase._id}\n\nYour purchase is confirmed. The car has been locked under your account. Check your dashboard for receipt details.\n\nBest regards,\nRentX Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #8b5cf6; text-align: center;">Purchase Confirmation & Invoice</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Congratulations! Your payment of <strong>₹${purchase.price.toLocaleString()}</strong> has been processed successfully. You are now the official owner of the vehicle listed below.</p>
      
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">Invoice Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold; width: 35%;">Invoice ID:</td>
            <td style="padding: 5px 0; font-family: monospace;">${purchase._id}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Vehicle:</td>
            <td style="padding: 5px 0; font-weight: bold;">${car.name}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Total Cost:</td>
            <td style="padding: 5px 0; color: #8b5cf6; font-weight: bold;">₹${purchase.price.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Status:</td>
            <td style="padding: 5px 0; color: #10b981; font-weight: bold;">PAID & DELIVERED</td>
          </tr>
        </table>
      </div>
      
      <p>You can view your purchased fleet and download this invoice anyway directly under "Your Car Purchases" in your User Dashboard.</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="http://localhost:5173/dashboard" style="background-color: #8b5cf6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Purchased Fleet</a>
      </div>
      
      <p>Best regards,<br/><strong>RentX Team</strong></p>
    </div>
  `;
  // Send invoice receipt to user
  await sendMail({ to: email, subject, text, html });

  // Send sales alert to admin
  const adminEmail = process.env.EMAIL_USER || "admin@rentx.com";
  const adminSubject = `🚨 Car Sold Alert: ${car.name} purchased by ${name}`;
  const adminText = `Hello Admin,\n\nA vehicle has been purchased from the RentX Marketplace.\n\nBuyer Details:\n- Name: ${name}\n- Email: ${email}\n\nVehicle Details:\n- Car Name: ${car.name}\n- Purchase Price: ₹${purchase.price.toLocaleString()}\n- Invoice ID: ${purchase._id}\n\nPlease check your Admin Dashboard for sales history details.\n\nBest regards,\nRentX System`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #ef4444; text-align: center;">🚨 Marketplace Car Sales Notification</h2>
      <p>Hello Admin,</p>
      <p>A vehicle has been successfully sold on the RentX Marketplace showroom.</p>
      
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #ef4444;">Sales Report</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold; width: 35%;">Buyer Name:</td>
            <td style="padding: 5px 0; font-weight: bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Buyer Email:</td>
            <td style="padding: 5px 0; font-family: monospace;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Car Purchased:</td>
            <td style="padding: 5px 0; font-weight: bold;">${car.name}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Sales Price:</td>
            <td style="padding: 5px 0; color: #10b981; font-weight: bold;">₹${purchase.price.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #6b7280; font-weight: bold;">Invoice ID:</td>
            <td style="padding: 5px 0; font-family: monospace;">${purchase._id}</td>
          </tr>
        </table>
      </div>
      
      <p>Log in to your admin panel to view the transaction audit log.</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="http://localhost:5173/admin" style="background-color: #ef4444; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Admin Dashboard</a>
      </div>
    </div>
  `;

  return sendMail({ to: adminEmail, subject: adminSubject, text: adminText, html: adminHtml });
};

// Send contact message email to admin & customer
const sendContactFormEmail = async ({ name, email, message }) => {
  const adminSubject = `New Contact Form Inquiry - ${name}`;
  const adminText = `You have received a new inquiry from ${name} (${email}):\n\n${message}`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #6366f1; text-align: center;">New Contact Support Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb;">
        ${message.replace(/\n/g, "<br/>")}
      </div>
    </div>
  `;

  // Send to admin first (fallback or custom EMAIL_USER/EMAIL_FROM)
  const adminEmail = process.env.EMAIL_USER || "admin@rentx.com";
  await sendMail({ to: adminEmail, subject: adminSubject, text: adminText, html: adminHtml });

  // Send a thank you reply to user
  const userSubject = "We received your message! - RentX Support";
  const userText = `Hello ${name},\n\nThank you for reaching out to RentX. We have received your inquiry and our support team will get back to you shortly.\n\nYour message:\n"${message}"\n\nBest regards,\nRentX Support`;
  const userHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #6366f1; text-align: center;">Thank You for Reaching Out!</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>We have successfully received your inquiry. Our support representative will review your message and get back to you within 24 hours.</p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb; font-style: italic; color: #555; margin: 20px 0;">
        "${message.replace(/\n/g, "<br/>")}"
      </div>
      <p>Best regards,<br/><strong>RentX Support Team</strong></p>
    </div>
  `;
  return sendMail({ to: email, subject: userSubject, text: userText, html: userHtml });
};

// Send OTP Email
const sendOtpEmail = async (email, otp) => {
  const subject = "Your OTP Verification Code - RentX Registration";
  const text = `Your RentX One-Time Password (OTP) verification code is ${otp}. This code is valid for 5 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #6366f1; text-align: center;">Verify Your RentX Account</h2>
      <p>Hello,</p>
      <p>Thank you for choosing RentX Car Rental. To complete your signup registration, please verify your email address by using the One-Time Password (OTP) code listed below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background-color: #f3f4f6; border: 2px dashed #6366f1; color: #312e81; padding: 15px 30px; font-size: 28px; font-weight: 900; letter-spacing: 5px; border-radius: 8px;">
          ${otp}
        </span>
      </div>
      <p style="color: #ef4444; font-weight: bold; font-size: 11px; text-align: center;">This verification code is valid for 5 minutes only.</p>
      <p>If you did not request this OTP code, you can safely ignore this email.</p>
      <p>Best regards,<br/><strong>RentX Team</strong></p>
    </div>
  `;
  return sendMail({ to: email, subject, text, html });
};

module.exports = {
  sendWelcomeEmail,
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
  sendPurchaseReceiptEmail,
  sendContactFormEmail,
  sendOtpEmail,
};
