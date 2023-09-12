const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: { type: String, default: '' },
    avatar: { type: String, default: '' },
    type: { type: String, default: '' },
    status: { type: Boolean, default: true },
    userID: { type: mongoose.Types.ObjectId, default: null },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})

module.exports = mongoose.model('library', schema)