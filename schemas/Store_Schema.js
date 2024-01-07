const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    title: { type: String, require: true, unique: true },
    time: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    email: { type: String, default: '' },
    avatar: { type: String, default: '' },
    map: { type: String, default: '' },
    userID: { type: mongoose.Types.ObjectId, default: null },
    status: { type: Boolean, default: true },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})
module.exports = mongoose.model('store', schema)