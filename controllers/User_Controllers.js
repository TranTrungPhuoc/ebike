const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const User_Models = require('../models/User_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
const Convert=require('../helpers/Convert')
class User_Controllers extends Controllers{
    
    constructor(req, res){
        super(req, res)
        this.model = User_Models
        this.title = 'email'
    }

    async checkForm(id){
        const formList=await this.formList(id);
        let errors = [];
        for (let index = 0; index < formList.length; index++) {
            const field=formList[index]['id']
            const value=this.getValue(field)
            if(value != undefined){
                const checkEmpty=Validation.checkEmpty(value)
                if(!checkEmpty){
                    errors.push({ [field]: Error.index(401, Convert.index(field)) })
                }else{
                    if(field=='email'&&formList[index]['check']==true){
                        if(!this.checkFormatEmail()){
                            errors.push({ [field]: Error.index(402, Convert.index(field)) })
                        }
                        if(errors.length==0){
                            if(!await this.checkExistData(field, id)){
                                errors.push({ [field]: Error.index(403, Convert.index(field)) })
                            }
                        }
                    }
                    if(field=='phone'&&formList[index]['check']==true){
                        if(!this.checkFormatPhone()){
                            errors.push({ [field]: Error.index(402, Convert.index(field)) })
                        }
                        if(errors.length==0){
                            if(!await this.checkExistData(field, id)){
                                errors.push({ [field]: Error.index(403, Convert.index(field)) })
                            }
                        }
                    }
                    if(field=='password'&&formList[index]['check']==true){
                        if(!this.checkPasswordLength(6)){
                            errors.push({ [field]: Error.index(406, Convert.index(field), 6) })
                        }
                    }
                    if(field=='re_password'&&formList[index]['check']==true){
                        if(!this.checkPasswordCompare()){
                            errors.push({ [field]: Error.index(405) })
                        }
                    }
                }
            }
        }
        return errors
    }

    async arrayFull(){ 
        return await this.dataFull(this.title);
    }

    async formList(data){
        return [
            { title: 'Email', type: 'email', col: 6, class: 'email form-control ', id: 'email', value: (data.length==0)?'':data[0]['email'], placeholder: 'Ví dụ: abc@gmail.com', require: false, disabled: false, check: true, event: '' },
            { title: 'Điện Thoại', type: 'tel', col: 6, class: 'phone form-control ', id: 'phone', value: (data.length==0)?'':data[0]['phone'], placeholder: 'Ví dụ: 0333444555', require: false, disabled: false, check: true, event: '' },
            { title: 'Mật Khẩu', type: 'password', col: 6, class: 'password form-control ', id: 'password', value:'', placeholder: '******', require: false, disabled: (data.length==0)?false:true, check: true, event: '' },
            { title: 'Xác Nhận Mật Khẩu', type: 'password', col: 6, class: 're_password form-control ', id: 're_password', value:'', placeholder: '******', require: false, disabled: (data.length==0)?false:true, check: true, event: '' },
        ]
    }

    theadList(){
        return [
            {title: 'Avatar', class:'text-center', width: '5%'},
            {title: 'Email', class:'', width: ''},
            {title: 'Ngày Tạo', class: 'text-center', width: '15%'},
            {title: 'Hiển Thị', class: 'text-center', width: '10%'},
            {title: 'Chức Năng', class: 'text-center', width: '15%'}
        ]
    }

    async tbodyList(){
        const array = await this.dataCommon(this.title)
        let tr='';
        for (let index = 0; index < array.length; index++) {
            let td='';
            const element = array[index]
            td+=this.tdImage(element['avatar']!=''?'/uploads/'+this.params(2)+'/'+element['avatar']:'/assets/images/photrader.jpeg',element['_id'])
            td+=Html.td(element[this.title], ' align-middle')
            td+=this.tdDate(element['created'])
            td+=this.tdStatus(element['_id'], element['status'])
            td+=this.tdFunction(element['_id'], this.params(2), element[this.title])
            tr+=Html.tr(td,element['_id'])
        }
        return Html.tbody(tr)
    }

    logout(){
        this.res.clearCookie('user').redirect('/')
    }

}
module.exports = User_Controllers