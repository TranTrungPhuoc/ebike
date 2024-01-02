const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: { type: String, require: true, unique: true },
    price: { type: Number, default: 0 },
    userID: { type: mongoose.Types.ObjectId, default: null },
    status: { type: Boolean, default: true },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})

module.exports = mongoose.model('delivery', schema)