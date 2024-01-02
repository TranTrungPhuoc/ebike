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

    async getProvince(){
        const response = await Site_Models.provinceList();
        return this.res.send({
            code: 200,
            message: "Success",
            response
        })
    }

    async getDistrict(){
        const citycode = this.req.query.citycode;
        const response = await Site_Models.districtList(citycode);
        return this.res.send({
            code: 200,
            message: "Success",
            response
        })
    }

    async getWards(){
        const districtcode = this.req.query.districtcode;
        const response = await Site_Models.wardsList(districtcode);
        return this.res.send({
            code: 200,
            message: "Success",
            response
        })
    }
}

module.exports = Site_Api