const Subscription = require("../models/Subscription");

exports.createSubscription = async (req, res) => {
  const { clientName, contactInfo, startDate, endDate } = req.body;

  try {
    const newSubscription = new Subscription({
      clientName,
      contactInfo,
      startDate,
      endDate,
    });
    await newSubscription.save();
    res.status(201).json({ message: "Subscription created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};