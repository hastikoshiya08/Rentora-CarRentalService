const nodemailer = require("nodemailer");
// console.log(process.env.EMAIL_USER);
// console.log(process.env.EMAIL_PASS);
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
        
      },
    });

    const mailOptions = {
      from: `"Rentora Car Rental" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully to", to);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
};

module.exports = sendEmail;