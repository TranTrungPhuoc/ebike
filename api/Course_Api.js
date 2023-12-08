const Api = require('../helpers/Api')
const Course_Models = require('../models/Course_Models')
class Course_Api extends Api{
    constructor(req, res){
        super(req, res)
    }

    async getListApi(){
        const data = await Course_Models.getListApi();
        this.res.send({
            code: 200,
            message: "Success",
            response: {
                data
            }
        })
    }

    async postRegisterApi(){
        const { fullname, email, phone,  schedule } = this.req.body
    
        if(!fullname || fullname.trim() == ''){
            this.res.send({
                code: 600,
                message: "Error",
                response: {
                    error: "Họ Tên không được rỗng."
                }
            })
            return
        }
    
        if(!email || email.trim() == ''){
            this.res.send({
                code: 600,
                message: "Error",
                response: {
                    error: "Email không được rỗng."
                }
            })
            return
        }
    
        const pattern_Email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    
        if(pattern_Email.test(email.trim()) == false){
            this.res.send({
                code: 600,
                message: "Error",
                response: {
                    error: "Email không hợp lệ."
                }
            })
            return
        }
    
        if(!phone || phone.trim() == ''){
            this.res.send({
                code: 600,
                message: "Error",
                response: {
                    error: "Phone không được rỗng."
                }
            })
            return
        }
    
        const pattern_Phone = /^(0[3|5|7|8|9])+([0-9]{8})$/
    
        if(pattern_Phone.test(phone.trim()) == false){
            this.res.send({
                code: 600,
                message: "Error",
                response: {
                    error: "Số Điện Thoại không hợp lệ."
                }
            })
            return
        }
    
        if(!schedule || schedule.trim() == ''){
            this.res.send({
                code: 600,
                message: "Error",
                response: {
                    error: "Schedule không được rỗng."
                }
            })
            return
        }
    
        this.req.body['status'] = false;

        const data = await Course_Models.createApi(this.req.body)
    
        this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }
}

module.exports = Course_Api