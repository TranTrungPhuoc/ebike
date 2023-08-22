const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const Library_Models = require('../models/Library_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
const Convert=require('../helpers/Convert')
class Library_Controllers extends Controllers{
    
    constructor(req, res){
        super(req, res)
        this.model = Library_Models
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
                }
            }
        }
        return errors
    }

    async arrayFull(){ 
        return await this.dataFull(this.title);
    }

    typeList(){
        return [
            {value: 'logoTop', name: 'Logo Top'},
            {value: 'favicon', name: 'Favicon'},
            {value: 'logoBottom', name: 'Logo Bottom'}
        ]
    }

    async formList(data){
        return [
            { title: 'Tiêu Đề', type: 'text', col: 4, class: 'title form-control ', id: 'title', value: (data.length==0)?'':data[0]['title'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Loại', type: 'select', col: 4, class: 'type form-control ', id: 'type', array: this.typeList(), require: false, disabled: false, check: false, event: '' },
        ]
    }

    theadList(){
        return [
            {title: 'Avatar', class:'text-center', width: '5%'},
            {title: 'Tiêu Đề', class:'', width: ''},
            {title: 'Loại Ảnh', class: 'text-center', width: '10%'},
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
            td+=this.tdType(element['type'])
            td+=this.tdDate(element['created'])
            td+=this.tdStatus(element['_id'], element['status'])
            td+=this.tdFunction(element['_id'], this.params(2), element[this.title])
            tr+=Html.tr(td,element['_id'])
        }
        return Html.tbody(tr)
    }

}
module.exports = Library_Controllers