const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const Site_Models = require('../models/Site_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
const Convert=require('../helpers/Convert')
class Site_Controllers extends Controllers{
    
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
            { title: 'Mua Hàng', type: 'text', col: 6, class: 'purchase form-control ', id: 'purchase', value: (data.length==0)?'':data[0]['purchase'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Bảo Hành', type: 'text', col: 6, class: 'guarantee form-control ', id: 'guarantee', value: (data.length==0)?'':data[0]['guarantee'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Địa Chỉ Cửa Hàng', type: 'textarea', col: 12, class: 'address form-control ', id: 'address', value: (data.length==0)?'':data[0]['address'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            
            { title: 'Hotline', type: 'text', col: 4, class: 'hotline form-control ', id: 'hotline', value: (data.length==0)?'':data[0]['hotline'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'CSKH', type: 'text', col: 4, class: 'cskh form-control ', id: 'cskh', value: (data.length==0)?'':data[0]['cskh'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Email', type: 'text', col: 4, class: 'email form-control ', id: 'email', value: (data.length==0)?'':data[0]['email'], placeholder: '', require: false, disabled: false, check: false, event: '' },

            { title: 'Meta Title', type: 'text', col: 6, class: 'metaTitle form-control ', id: 'metaTitle', value: (data.length==0)?'':data[0]['metaTitle'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Copy Right', type: 'text', col: 6, class: 'copyRight form-control ', id: 'copyRight', value: (data.length==0)?'':data[0]['copyRight'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Meta Description', type: 'textarea', col: 12, class: 'metaDescription form-control ', id: 'metaDescription', value: (data.length==0)?'':data[0]['metaDescription'], placeholder: '', require: false, disabled: false, check: false, event: '' },
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
module.exports = Site_Controllers