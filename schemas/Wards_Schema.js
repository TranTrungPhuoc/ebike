const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    wardcode: String,
    wardname: String,
    districtcode: String,
})

module.exports = mongoose.model('ward', schema)