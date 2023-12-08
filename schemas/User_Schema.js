const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    email: { type: String, require: true, unique: true },
    phone: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    avatar: { type: String, default: '' },
    role: { type: String, default: 'user' },
    description: { type: String, default: '' },
    userID: { type: mongoose.Types.ObjectId, default: null },
    status: { type: Boolean, default: true },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})
module.exports = mongoose.model('user', schema)