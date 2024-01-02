const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    fullname: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    phone: { type: String, require: true, unique: true },
    nation: { type: String, require: true },
    province: { type: String, require: true },
    district: { type: String, require: true },
    wards: { type: String, require: true },
    address: { type: String, require: true },
    userID: { type: mongoose.Types.ObjectId, default: null },
    status: { type: Boolean, default: true },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})
module.exports = mongoose.model('customer', schema)