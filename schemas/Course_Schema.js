const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    fullname: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    schedule: { type: String, require: true },
    agree: { type: Boolean, default: true },
    status: { type: Boolean, default: true },
    userID: { type: mongoose.Types.ObjectId, default: null },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})

module.exports = mongoose.model('course', schema)