const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    citycode: String,
    cityname: String
})

module.exports = mongoose.model('province', schema)