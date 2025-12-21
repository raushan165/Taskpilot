const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    deadline: { type: Date },
    completed: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Task', TaskSchema);