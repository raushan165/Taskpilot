// models/ContactMessage.js
const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    services: {
      website: { type: Boolean, default: false },
      ux: { type: Boolean, default: false },
      strategy: { type: Boolean, default: false },
      other: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
