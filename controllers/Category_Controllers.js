const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const Category_Models = require('../models/Category_Models')
const User_Models = require('../models/User_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
const Convert=require('../helpers/Convert')
class Category_Controllers extends Controllers{
    
    constructor(req, res){
        super(req, res)
        this.model = Category_Models
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
                    if(field=='slug'&&formList[index]['check']==true){
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

    typeList(){
        return [
            {value: 'tintuc', name: 'Tin Tức'}, 
            {value: 'tamsu', name: 'Tâm Sự'}, 
            {value: 'sach', name: 'Sách'},
            {value: 'video', name: 'video'}
        ];
    }

    async formList(data){
        return [
            { title: 'Tiêu Đề', type: 'text', col: 4, class: 'title form-control ', id: 'title', value: (data.length==0)?'':data[0]['title'], placeholder: '', require: false, disabled: false, check: true, event: 'onchange=titleChangeToSlug() onkeyup=titleChangeToSlug()' },
            { title: 'Slug', type: 'text', col: 4, class: 'slug form-control ', id: 'slug', value: (data.length==0)?'':data[0]['slug'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Loại', type: 'select', col: 4, class: 'type form-control ', id: 'type', array: this.typeList(), require: false, disabled: false, check: false, event: '' },
            { title: 'Mô tả', type: 'textarea', col: 12, class: 'description form-control ', id: 'description', value: (data.length==0)?'':data[0]['description'], placeholder: '', row: 3, check: false },
            { title: 'Nội Dung', type: 'ckeditor', col: 12, class: 'content form-control ', id: 'content', value: (data.length==0)?'':data[0]['content'], placeholder: '', row: 3, check: false },
            { title: 'Canonical', type: 'text', col: 6, class: 'canonical form-control ', id: 'canonical', value: (data.length==0)?'':data[0]['canonical'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Meta Title', type: 'text', col: 6, class: 'metaTitle form-control ', id: 'metaTitle', value: (data.length==0)?'':data[0]['metaTitle'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Meta Description', type: 'textarea', col: 12, class: 'metaDescription form-control ', id: 'metaDescription', value: (data.length==0)?'':data[0]['metaDescription'], placeholder: '', row: 3, check: false },
        ]
    }

    theadList(){
        return [
            {title: 'Tiêu Đề', class:'', width: ''},
            {title: 'Loại', class: 'text-center', width: '10%'},
            {title: 'Ngày Tạo', class: 'text-center', width: '10%'},
            {title: 'Người Tạo', class: 'text-center', width: '15%'},
            {title: 'Hiển Thị', class: 'text-center', width: '5%'},
            {title: 'Chức Năng', class: 'text-center', width: '10%'}
        ]
    }

    async tbodyList(){
        const link = 'https://photrader.com/';
        const array = await this.dataCommon(this.title, {'created': -1})
        let tr='';
        for (let index = 0; index < array.length; index++) {
            const element = array[index]
            const user = await User_Models.getDetail({_id:element['userID']})
            let td='';
            td+=Html.td(Html.a(element[this.title], link + element['slug'], 'nav-link', '_blank'), ' align-middle')
            td+=this.tdType(element['type'])
            td+=this.tdDate(element['created'])
            td+=this.tdUser(user[0]['email'])
            td+=this.tdStatus(element['_id'], element['status'])
            td+=this.tdFunction(element['_id'], this.params(2), element[this.title])
            tr+=Html.tr(td,element['_id'])
        }
        return Html.tbody(tr)
    }
}
module.exports = Category_Controllers