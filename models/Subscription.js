// models/Subscription.js

const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    contactInfo: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['active', 'expiring', 'expired'],
        default: 'active',
    },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
