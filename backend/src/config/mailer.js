const path = require("path");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });

const sendOtpEmail = async ({ to, otp, username }) => {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_APP_PASSWORD) {
    throw new Error("SMTP credentials are not configured");
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_EMAIL,
    to,
    subject: "QuickShopping password reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">QuickShopping password reset</h2>
        <p>Hello ${username || "Customer"},</p>
        <p>Use the OTP below to change your password. This OTP expires in 10 minutes.</p>
        <div style="display: inline-block; margin: 16px 0; padding: 12px 18px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; font-size: 24px; font-weight: 700; letter-spacing: 6px; color: #1d4ed8;">
          ${otp}
        </div>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
};

module.exports = {
  sendOtpEmail,
};