const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const Site_Models = require('../models/Site_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
const Convert=require('../helpers/Convert')
class Mail_Controllers extends Controllers{
    
    constructor(req, res){
        super(req, res)
        this.model = Site_Models
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
        return await this.dataFull('email');
    }

    async formList(data){
        return [
            { title: 'Host', type: 'text', col: 6, class: 'host form-control ', id: 'host', value: (data.length==0)?'':data[0]['host'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Port', type: 'text', col: 6, class: 'port form-control ', id: 'port', value: (data.length==0)?'':data[0]['port'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Username', type: 'text', col: 6, class: 'username form-control ', id: 'username', value: (data.length==0)?'':data[0]['username'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Password', type: 'password', col: 6, class: 'password form-control ', id: 'password', value: (data.length==0)?'':data[0]['password'], placeholder: '', require: false, disabled: false, check: false, event: '' },
        ]
    }

    theadList(){
        return [
            {title: 'Tên', class:'', width: ''},
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
            td+=Html.td(array[index][this.title])
            td+=this.tdDate(array[index]['created'])
            td+=this.tdStatus(array[index]['_id'], array[index]['status'])
            td+=this.tdFunction(array[index]['_id'], this.params(2), array[index][this.title])
            tr+=Html.tr(td,array[index]['_id'])
        }
        return Html.tbody(tr)
    }

}
module.exports = Mail_Controllers