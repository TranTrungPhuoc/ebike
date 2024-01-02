const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    code: { type: String, default: '' },
    total: { type: Number, default: 0 },
    note: { type: String, default: '' },
    customer: { type: mongoose.Types.ObjectId, default: null },
    delivery: { type: mongoose.Types.ObjectId, default: null },
    payment: { type: mongoose.Types.ObjectId, default: null },
    detail: { type: Array, default: [] },
    userID: { type: mongoose.Types.ObjectId, default: null },
    status: { type: Boolean, default: false },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})
module.exports = mongoose.model('order', schema)