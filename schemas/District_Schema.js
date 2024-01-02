const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    districtcode: String,
    districtname: String,
    citycode: String,
})

module.exports = mongoose.model('district', schema)