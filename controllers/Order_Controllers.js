const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const Order_Models = require('../models/Order_Models')
const User_Models = require('../models/User_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
const Convert=require('../helpers/Convert')

class Order_Controllers extends Controllers{
    
    constructor(req, res){
        super(req, res)
        this.model = Order_Models
        this.title = 'customer'
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
            { title: 'Họ & Tên', type: 'text', col: 4, class: 'fullname form-control ', id: 'fullname', value: (data.length==0)?'':data[0]['fullname'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Địa chỉ Email', type: 'text', col: 4, class: 'email form-control ', id: 'email', value: (data.length==0)?'':data[0]['email'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Số Điện Thoại', type: 'text', col: 4, class: 'phone form-control ', id: 'phone', value: (data.length==0)?'':data[0]['phone'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Quốc Gia', type: 'select', col: 4, class: 'nation form-control ', id: 'nation', array: [], require: false, disabled: false, check: false, event: '' },
            { title: 'Tỉnh / Thành phố', type: 'select', col: 4, class: 'province form-control ', id: 'province', array: [], require: false, disabled: false, check: false, event: '' },
            { title: 'Quận / Huyện', type: 'select', col: 4, class: 'district form-control ', id: 'district', array: [], require: false, disabled: false, check: false, event: '' },
            { title: 'Phường / Xã', type: 'select', col: 4, class: 'wards form-control ', id: 'wards', array: [], require: false, disabled: false, check: false, event: '' },
            { title: 'Địa chỉ', type: 'text', col: 8, class: 'address form-control ', id: 'address', value: (data.length==0)?'':data[0]['address'], placeholder: '', require: false, disabled: false, check: true, event: '' },
        ]
    }

    theadList(){
        return [
            {title: 'Mã Đơn Hàng', class:'', width: ''},
            {title: 'Tổng Tiền', class:'', width: ''},
            {title: 'Ghi Chú', class:'', width: ''},
            {title: 'Khách Hàng', class:'', width: ''},
            {title: 'PT Giao Hàng', class:'', width: ''},
            {title: 'PT Thanh Toán', class:'', width: ''},
            // {title: 'Ngày Tạo', class: 'text-center', width: '10%'},
            {title: 'Người Tạo', class: 'text-center', width: '10%'},
            {title: 'Đã Xử Lý', class: 'text-center', width: '5%'},
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
            td+=Html.td(element['code'],' align-middle')
            td+=Html.td(element['total'],' align-middle')
            td+=Html.td(element['note'],' align-middle')
            td+=Html.td(element['customer'],' align-middle')
            td+=Html.td(element['delivery'],' align-middle')
            td+=Html.td(element['payment'],' align-middle')
            td+=this.tdDate(element['created'])
            // td+=this.tdUser(user.length>0?user[0]['email'].split('@')[0]:'')
            td+=this.tdStatus(element['_id'], element['status'])
            td+=this.tdFunction(element['_id'], this.params(2), element[this.title])
            tr+=Html.tr(td,element['_id'])
        }
        return Html.tbody(tr)
    }

}
module.exports = Order_Controllers