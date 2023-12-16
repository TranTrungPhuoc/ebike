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
    realImage: { type: String, default: '' },
    specifications: { type: String, default: '' },

    library: { type: String, default: '' },

    color: { type: Array, default: [] },
    pin: { type: Array, default: [] },

    price: { type: Number, default: 0 },
    linkRegister: { type: String, default: '' },

    status: { type: Boolean, default: true },
    float: { type: Boolean, default: false },
    view: { type: Number, default: 0 },

    canonical: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },

    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})

module.exports = mongoose.model('product', schema)