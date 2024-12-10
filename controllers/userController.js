const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//(Signup)
router.post('/signup', async (req, res) => {
    try {
        const { username, password, role } = req.body;

       
        const userInDB = await User.findOne({ username });
        if (userInDB) {
            return res.status(400).json({ error: 'Username already taken.' });
        }

        const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));

        const user = await User.create({
            username,
            hashedPassword,
            role,
        });

        const token = jwt.sign(
            { username: user.username, _id: user._id, role: user.role },
            process.env.JWT_SECRET
        );

        res.status(201).json({ message: 'User registered successfully!', user, token });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// (Login)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

    
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

       
        const isPasswordValid = bcrypt.compareSync(password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

  
        const token = jwt.sign(
            { username: user.username, _id: user._id, role: user.role },
            process.env.JWT_SECRET
        );

       
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
