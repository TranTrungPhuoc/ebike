const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    contentCourse: { type: String, default: '' },
    contentFooter: { type: String, default: '' },
    titleNetwork: { type: String, default: '' },
    copyRight: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    host: { type: String, default: '' },
    port: { type: String, default: '' },
    username: { type: String, default: '' },
    password: { type: String, default: '' }
})

module.exports = mongoose.model('site', schema)