const Api = require('../helpers/Api')
const Menu_Models = require('../models/Menu_Models')
class Menu_Api extends Api{
    constructor(req, res){
        super(req, res)
    }
    async getList(){
        const {location} = this.req.query
        if(!location){
            this.res.send({
                code: 600, 
                message: 'Error', 
                response: 'Location không được rỗng'
            })
            return;
        }
        if(location.trim() === ''){
            this.res.send({
                code: 600, 
                message: 'Error', 
                response: 'Location không được rỗng'
            })
            return;
        }
        if(!(location.toLowerCase() == 'top' || location.toLowerCase() == 'bottom')){
            this.res.send({
                code: 600, 
                message: 'Error', 
                response: 'Location không đúng định dạng'
            })
            return;
        }
        const response = await Menu_Models.getListLayout(location);
        return this.res.send({
            code: 200,
            message: "Success",
            response: {
                location,
                total: response.total.length,
                data: response.data
            }
        })
    }
}

module.exports = Menu_Api