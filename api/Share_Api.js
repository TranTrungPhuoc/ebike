const Api = require('../helpers/Api')
const Share_Models = require('../models/Share_Models')
class Share_Api extends Api{
    constructor(req, res){
        super(req, res)
    }
    async getItemsHome(){
        let { limit } = this.req.query
        const data = await Share_Models.getItemsHome(limit!=undefined?parseInt(limit):10)
        this.res.send({
            code: 200,
            message: "Success",
            response: {
                data
            }
        })
    }
}

module.exports = Share_Api