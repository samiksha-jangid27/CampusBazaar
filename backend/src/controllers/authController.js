const { prisma } = require('../config/db');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  // Use SMTP / service configured via env
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.requestOTP = async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  try {
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // create or update user with OTP
    const user = await prisma.user.upsert({
      where: { email },
      update: { otp, otpExpires, name },
      create: { email, name, otp, otpExpires },
    });

    // send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your CampusBazaar OTP',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('requestOTP error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // mark verified and clear OTP
    await prisma.user.update({
      where: { email },
      data: { isVerified: true, otp: null, otpExpires: null },
    });

    // issue JWT token (used for authenticated endpoints)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

res.status(200).json({
  message: "Email verified successfully!",
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
  },
});

  } catch (err) {
    console.error('verifyOTP error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
