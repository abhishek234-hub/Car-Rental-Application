const twilio = require("twilio");

let client = null;

const initTwilio = () => {
  if (client) return client;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (accountSid && authToken) {
    console.log("Using Twilio credentials from environment variables for SMS sending.");
    client = twilio(accountSid, authToken);
  } else {
    console.log("No TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN found in environment.");
    console.log("Falling back to mock console SMS transmitter.");
    client = {
      messages: {
        create: async (options) => {
          console.log("\n================ MOCK SMS SENT ================");
          console.log(`FROM (Twilio Number): ${options.from}`);
          console.log(`TO (User Phone): ${options.to}`);
          console.log(`MESSAGE BODY: ${options.body}`);
          console.log("===============================================\n");
          return { sid: "mock-sms-id-" + Math.random().toString(36).slice(2) };
        }
      }
    };
  }
  return client;
};

const sendSms = async ({ to, body }) => {
  try {
    const twilioClient = initTwilio();
    const fromNumber = process.env.TWILIO_PHONE_NUMBER || "+1234567890";
    
    const message = await twilioClient.messages.create({
      body,
      from: fromNumber,
      to,
    });

    console.log(`SMS sent successfully: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    return { success: false, error: error.message };
  }
};

const sendBookingConfirmationSms = async (phone, name, booking, car) => {
  const formattedPickupDate = new Date(booking.pickupDate).toLocaleDateString();
  const body = `Hello ${name},\n\nWe have received your booking request for ${car.name}.\nPickup Location: ${booking.pickupLocation}\nPickup Date/Time: ${formattedPickupDate} at ${booking.pickupTime || "10:00"}\nStatus: Pending Admin Approval.\n\nThank you for choosing RentX!`;
  return sendSms({ to: phone, body });
};

const sendBookingStatusUpdateSms = async (phone, name, booking, car) => {
  const isAccepted = booking.status === "accepted";
  const formattedPickupDate = new Date(booking.pickupDate).toLocaleDateString();
  const body = `Hello ${name},\n\nYour RentX booking request for ${car.name} has been ${booking.status.toUpperCase()}.\nPickup: ${booking.pickupLocation} on ${formattedPickupDate}.\n\n${isAccepted ? "Enjoy your ride! Track it live in your dashboard." : "Please check our fleet to book another car."}\n\nBest regards,\nRentX Team`;
  return sendSms({ to: phone, body });
};

module.exports = {
  sendBookingConfirmationSms,
  sendBookingStatusUpdateSms,
};
