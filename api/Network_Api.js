const Api = require('../helpers/Api')
const Network_Models = require('../models/Network_Models')
class Network_Api extends Api{
    constructor(req, res){
        super(req, res)
    }

    async getSocialNetwork(){
        const {location} = this.req.query
        const data = await Network_Models.getSocialNetwork(location);
        this.res.send({
            code: 200,
            message: "Success",
            response: {
                data
            }
        })
    }
}

module.exports = Network_Api