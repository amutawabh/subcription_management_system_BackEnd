// controllers/subscriptionController.js

const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const verifyToken = require('../middleware/verifyToken');

// Get all subscriptions
router.get('/', verifyToken, async (req, res) => {
    try {
        const subscriptions = await Subscription.find(); 
        res.status(200).json(subscriptions); 
    } catch (error) {
        console.error('Error fetching subscriptions:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add a new subscription
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

// Update a subscription
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { clientName, contactInfo, startDate, endDate } = req.body;

        // Validate input fields
        if (!clientName || !contactInfo || !startDate || !endDate) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const updatedSubscription = await Subscription.findByIdAndUpdate(
            id,
            { clientName, contactInfo, startDate, endDate },
            { new: true } // Return the updated document
        );

        if (!updatedSubscription) {
            return res.status(404).json({ message: 'Subscription not found.' });
        }

        res.status(200).json({ message: 'Subscription updated successfully.', subscription: updatedSubscription });
    } catch (error) {
        console.error('Error updating subscription:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a subscription
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSubscription = await Subscription.findByIdAndDelete(id);

        if (!deletedSubscription) {
            return res.status(404).json({ message: 'Subscription not found.' });
        }

        res.status(200).json({ message: 'Subscription deleted successfully.' });
    } catch (error) {
        console.error('Error deleting subscription:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
