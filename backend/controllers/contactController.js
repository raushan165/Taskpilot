// controllers/contactController.js
const ContactMessage = require('../models/ContactMessage');
const sendEmail = require('../utils/sendEmail');

exports.createMessage = async (req, res) => {
  try {
    const { name, email, subject, message, services } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    // 1. Save message to DB
    const saved = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      services: services || {},
    });

    // 2. Send email to your inbox
    const servicesList = services
      ? Object.entries(services)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(', ')
      : '';

    const html = `
      <h2>New Contact Message - TaskMaster</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject || '-'}</p>
      <p><strong>Services:</strong> ${servicesList || '-'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendEmail(
      'ashniyaalosious7@gmail.com', // your inbox
      html,
      subject || 'New contact message',
      'CONTACT'
    );

    res.status(201).json({
      message: 'Message sent successfully',
      data: saved,
    });
  } catch (err) {
    console.error('Contact error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
