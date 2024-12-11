const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const verifyToken = require('../middleware/verifyToken');

// all Subscriptions
router.get('/', verifyToken, async (req, res) => {
    try {
        const subscriptions = await Subscription.find(); 
        res.status(200).json(subscriptions); 
    } catch (error) {
        console.error('Error fetching subscriptions:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/', verifyToken, async (req, res) => {
    try {
        const { clientName, contactInfo, startDate, endDate } = req.body;

        
        if (!clientName || !contactInfo || !startDate || !endDate) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        
        const newSubscription = new Subscription({
            clientName,
            contactInfo,
            startDate,
            endDate,
        });
        await newSubscription.save();

        res.status(201).json({ message: 'Subscription added successfully.', subscription: newSubscription });
    } catch (error) {
        console.error('Error adding subscription:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
