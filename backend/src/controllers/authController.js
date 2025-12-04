const { prisma } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// -------------------- SIGNUP --------------------
exports.signup = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    // Check if user exists (Prisma)
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user (Prisma)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        otp,
        otpExpires,
      },
    });

    // Send OTP mail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "CampusBazaar OTP Verification",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ message: "OTP sent. Please verify your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- VERIFY OTP --------------------
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpires: null,
      },
    });

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- LOGIN --------------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
