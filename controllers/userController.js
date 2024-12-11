// controllers/userController.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Middleware للتحقق من الصلاحيات
const isAdmin = (req, res, next) => {
    const { role } = req.user;
    if (role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access required.' });
    }
    next();
};

// Signup
router.post('/signup', asyncHandler(async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const userInDB = await User.findOne({ username });
    if (userInDB) {
        return res.status(400).json({ error: 'Username already taken.' });
    }

    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));
    const user = await User.create({ username, hashedPassword, role });
    const token = jwt.sign({ username: user.username, _id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.status(201).json({ message: 'User registered successfully!', user, token });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
        return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ username: user.username, _id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Login successful!', token });
}));

// Get all users
router.get('/', asyncHandler(async (req, res) => {
    const users = await User.find({}, '-hashedPassword');
    res.status(200).json(users);
}));

// Update user role
router.put('/:id', isAdmin, asyncHandler(async (req, res) => {
    const { role } = req.body;

    if (!['admin', 'employee'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role provided.' });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!updatedUser) {
        return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'User role updated successfully.', user: updatedUser });
}));

// Delete a user
router.delete('/:id', isAdmin, asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully.' });
}));

module.exports = router;
