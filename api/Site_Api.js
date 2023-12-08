const Api = require('../helpers/Api')
const Site_Models = require('../models/Site_Models')
class Site_Api extends Api{
    constructor(req, res){
        super(req, res)
    }
    async getList(){
        const data = await Site_Models.getList();
        return this.res.send({
            code: 200,
            message: "Success",
            response: {
                data
            }
        })
    }
}

module.exports = Site_Api