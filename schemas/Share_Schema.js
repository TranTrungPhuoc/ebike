const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    code: { type: String, require: true, unique: true },
    command: { type: String, require: true },
    entry: { type: String, require: true },
    sl: { type: String, require: true },
    tp: { type: String, require: true },
    link: { type: String, default: '' },
    result: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: Boolean, default: true },
    avatar: { type: String, default: '' },
    view: { type: Number, default: 0 },
    userID: { type: mongoose.Types.ObjectId, default: null },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})

module.exports = mongoose.model('share', schema)