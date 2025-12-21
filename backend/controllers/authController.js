const User = require('../models/User');
const OTP = require('../models/Otp');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Ensure you have installed: npm install jsonwebtoken
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  console.log("Creation Google Login Request with token length:", token ? token.length : 'null');
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log("Google Payload:", payload);
    const { name, email, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      console.log("Creating new Google user:", email);
      user = new User({ name, email, password: '' });
      await user.save();
    } else {
      console.log("Found existing user:", email);
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("Login successful, sending token");
    res.json({ token: jwtToken, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(400).json({ message: 'Google Sign-In failed: ' + err.message });
  }
};

// --- 1. SIGNUP FLOW ---

// Step A: Send OTP (Name & Email only)
exports.signup = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp });
    await sendEmail(email, otp, 'VERIFICATION');

    res.status(200).json({ message: 'OTP sent to email. Please verify.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Step B: Verify OTP & Create User
exports.verifySignup = async (req, res) => {
  try {
    const { email, otp, password, name } = req.body;
    const dbOtp = await OTP.findOne({ email, otp });
    if (!dbOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    await OTP.deleteOne({ email });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- 2. LOGIN FLOW (This was missing) ---

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Normalize input
    const normalizedEmail = email.trim();

    // 1. Check User (Case-insensitive)
    const user = await User.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- 3. FORGOT PASSWORD FLOW ---

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp });
    await sendEmail(email, otp, 'RESET');

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const dbOtp = await OTP.findOne({ email, otp });
    if (!dbOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await OTP.deleteOne({ email });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};