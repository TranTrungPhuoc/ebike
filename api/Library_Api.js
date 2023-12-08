const Api = require('../helpers/Api')
const Library_Models = require('../models/Library_Models')
class Library_Api extends Api{
    constructor(req, res){
        super(req, res)
    }
    async getDetail(){
        const {type} = this.req.query;
        if(!type){
            this.res.send({
                code: 600, 
                message: 'Error', 
                response: 'Type không được rỗng'
            })
            return;
        }
        if(type.trim() === ''){
            this.res.send({
                code: 600, 
                message: 'Error', 
                response: 'Type không được rỗng'
            })
            return;
        }
        const data = await Library_Models.getDetailApi(type);
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            element['avatar'] = this.req.protocol + '://' + this.req.headers.host + '/uploads/library/' + element['avatar'];
        }
        return this.res.send({
            code: 200,
            message: "Success",
            response: {
                type,
                data
            }
        })
    }
}

module.exports = Library_Api