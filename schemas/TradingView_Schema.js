const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    ticker: { type: String, default: '' },
    open: { type: String, default: '' },
    close: { type: String, default: '' },
    open: { type: String, default: '' },
    high: { type: String, default: '' },
    low: { type: String, default: '' },
    time: { type: Date, default: new Date() },
    volume: { type: String, default: '' },
    exchange: { type: String, default: '' },
    timenow: { type: Date, default: new Date() },
    interval: { type: String, default: '' },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})
module.exports = mongoose.model('TradingView', schema)