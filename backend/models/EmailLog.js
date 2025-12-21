// models/EmailLog.js
const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    from: { type: String, required: true },
    subject: { type: String, required: true },
    html: { type: String },
    type: { type: String }, // VERIFICATION / RESET / CONTACT
    status: { type: String, default: 'SENT' },
    error: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmailLog', emailLogSchema);
