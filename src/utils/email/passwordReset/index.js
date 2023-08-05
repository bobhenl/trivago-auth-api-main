const nodemailer = require("nodemailer");

// Configure the nodemailer settings in .env file
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD,
  },
  connectionTimeout: 10000, // 10s
});

async function sendPasswordResetEmail(email, resetToken) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_AUTH_USER,
      to: email,
      subject: "TRIVAGO - Password Reset Request",
      html: `
        <p>Hello,</p>
        <p>You have requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="https://trivago.gangoo.eu/change-password/${resetToken}">
          Reset Password
        </a>
        <p>If you did not initiate this request, please ignore this email.</p>
        <p>Best regards,</p>
        <p>Trivago</p>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending password reset email: ", error);
    throw error;
  }
}

module.exports = { sendPasswordResetEmail };
