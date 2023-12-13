const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    title: { type: String, require: true, unique: true },
    slug: { type: String, require: true, unique: true },
    parentID: { type: mongoose.Types.ObjectId, default: null },
    userID: { type: mongoose.Types.ObjectId, default: null },
    avatar: { type: String, default: '' },
    description: { type: String, default: '' },
    content: { type: String, default: '' },
    sort: { type: Number, default: 0 },
    type: { type: String, default: '' },
    status: { type: Boolean, default: true },
    float: { type: Boolean, default: false },
    canonical: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})
module.exports = mongoose.model('category', schema)