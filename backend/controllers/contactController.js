import nodemailer from "nodemailer";

// stop people from putting html/scripts in the email
const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMessageController = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }
    if (message.length > 2000) {
      return res.status(400).send({ success: false, message: "Message is too long" });
    }

    await transporter.sendMail({
      // gmail only sends from our own account, the visitor goes in reply-to
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `SnapCart contact from ${name.slice(0, 50)}`,
      html: `<h3>New Contact Message</h3>
             <p><strong>Name:</strong> ${escapeHtml(name)}</p>
             <p><strong>Email:</strong> ${escapeHtml(email)}</p>
             <p><strong>Message:</strong> ${escapeHtml(message)}</p>`,
    });

    res.status(200).send({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ success: false, message: "Failed to send message, try again later" });
  }
};
