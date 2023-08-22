const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: { type: String, require: true, unique: true },
    slug: { type: String, require: true, unique: true },
    parentID: { type: mongoose.Types.ObjectId, default: null },
    userID: { type: mongoose.Types.ObjectId, default: null },

    description: { type: String, default: '' },
    content: { type: String, default: '' },
    avatar: { type: String, default: '' },
    video: { type: String, default: '' },

    status: { type: Boolean, default: true },
    float: { type: Boolean, default: false },
    view: { type: Number, default: 0 },

    canonical: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },

    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})

module.exports = mongoose.model('post', schema)