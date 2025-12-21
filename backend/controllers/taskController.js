const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        // Sort by deadline (ascending) then priority
        const tasks = await Task.find({ user: req.user }).sort({ deadline: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const newTask = new Task({ ...req.body, user: req.user });
        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        console.log(`[DEBUG] Updating Task ${req.params.id} with:`, req.body); // DEBUG
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(`[DEBUG] Updated Task Result:`, task); // DEBUG
        res.json(task);
    } catch (err) {
        console.error('[DEBUG] Update Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};