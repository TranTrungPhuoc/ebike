const { default: mongoose } = require('mongoose');
const Api = require('../helpers/Api')
const Contact_Models = require('../models/Contact_Models')
const cheerio = require('cheerio');
class Contact_Api extends Api {
    constructor(req, res) {
        super(req, res)
    }
    async insert(){
        const {
            total,
            note,
            customer,
            delivery,
            payment,
            detail,
        } = this.req.body;
        this.req.body['code'] = 'XDV-' + Date.now();
        if(this.req.body['delivery']) this.req.body['delivery'] = new mongoose.Types.ObjectId(delivery)
        if(this.req.body['payment']) this.req.body['payment'] = new mongoose.Types.ObjectId(payment)
        const response = await Contact_Models.m_insert(this.req.body);
        this.res.send({
            code: 200,
            message: "Success",
            response
        })
    }
}

module.exports = Contact_Api