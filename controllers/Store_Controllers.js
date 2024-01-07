const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const Store_Models = require('../models/Store_Models')
const User_Models = require('../models/User_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
const Convert=require('../helpers/Convert')

class Store_Controllers extends Controllers{
    
    constructor(req, res){
        super(req, res)
        this.model = Store_Models
        this.title = 'title'
    }

    async checkForm(id){
        const formList=await this.formList(id);
        let errors = [];
        for (let index = 0; index < formList.length; index++) {
            const field=formList[index]['id']
            const value=this.getValue(field)
            if(value != undefined && formList[index]['check']==true){
                const checkEmpty=Validation.checkEmpty(value)
                if(!checkEmpty){
                    errors.push({ [field]: Error.index(401, Convert.index(field)) })
                }else{
                    if(field=='title'&&formList[index]['check']==true){
                        if(errors.length==0){
                            if(!await this.checkExistData(field, id)){
                                errors.push({ [field]: Error.index(403, Convert.index(field)) })
                            }
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
            { title: 'Tên Cửa Hàng', type: 'text', col: 6, class: 'title form-control ', id: 'title', value: (data.length==0)?'':data[0]['title'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Số Điện Thoại', type: 'text', col: 6, class: 'phone form-control ', id: 'phone', value: (data.length==0)?'':data[0]['phone'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Địa chỉ', type: 'text', col: 6, class: 'address form-control ', id: 'address', value: (data.length==0)?'':data[0]['address'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Thời Gian Làm Việc', type: 'text', col: 6, class: 'time form-control ', id: 'time', value: (data.length==0)?'':data[0]['time'], placeholder: '', require: false, disabled: false, check: true, event: '' },
        ]
    }

    theadList(){
        return [
            {title: 'Avatar', class:'text-center', width: '5%'},
            {title: 'Tên Cửa Hàng', class:'', width: ''},
            {title: 'Số Điện Thoại', class:'', width: ''},
            {title: 'Địa Chỉ', class:'', width: ''},
            {title: 'Thời Gian Làm Việc', class:'', width: ''},
            {title: 'Ngày Tạo', class: 'text-center', width: '10%'},
            {title: 'Người Tạo', class: 'text-center', width: '10%'},
            {title: 'Hiển Thị', class: 'text-center', width: '5%'},
            {title: 'Chức Năng', class: 'text-center', width: '10%'}
        ]
    }

    splitString(string, so){
        const array = string.split(' ');
        let newString = '';
        for (let index = 0; index < array.length; index++) {
            if(index <= so){
                const element = array[index];
                newString += element + ' ';
            }
        }
        newString =  newString.trim() + '...';
        return newString;
    }

    async tbodyList(){
        const array = await this.dataCommon(this.title, {'created': -1})
        let tr='';
        for (let index = 0; index < array.length; index++) {
            let td='';
            const element = array[index]
            const user = await User_Models.getDetail({_id:element['userID']})
            td+=this.tdImage(element['avatar']!=''?'/uploads/'+this.params(2)+'/'+element['avatar']:'/assets/images/photrader.png',element['_id'])
            td+=Html.td(element[this.title],' align-middle')
            td+=Html.td(element['phone'],' align-middle')
            td+=Html.td(element['address'],' align-middle')
            td+=Html.td(element['time'],' align-middle')
            td+=this.tdDate(element['created'])
            td+=this.tdUser(user.length>0?user[0]['email'].split('@')[0]:'')
            td+=this.tdStatus(element['_id'], element['status'])
            td+=this.tdFunction(element['_id'], this.params(2), element[this.title])
            tr+=Html.tr(td,element['_id'])
        }
        return Html.tbody(tr)
    }

}
module.exports = Store_Controllers