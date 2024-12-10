const express = require('express');
const router = express.Router();
const Subscription = require("../models/Subscription");

// Create a new subscription
router.post('/', async (req, res) => {
  const { clientName, contactInfo, startDate, endDate } = req.body;

  try {
    const newSubscription = new Subscription({
      clientName,
      contactInfo,
      startDate,
      endDate,
    });
    await newSubscription.save();
    res.status(201).json({ message: "Subscription created successfully", subscription: newSubscription });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all subscriptions
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a subscription by ID
router.get('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a subscription by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json({ message: "Subscription updated successfully", subscription: updatedSubscription });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a subscription by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
