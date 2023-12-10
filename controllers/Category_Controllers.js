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
            {value: 'sanpham', name: 'Sản Phẩm'},
            {value: 'tintuc', name: 'Tin Tức'},
            {value: 'video', name: 'Video'}
        ];
    }

    async formList(data){
        return [
            { title: 'Tiêu Đề', type: 'text', col: 6, class: 'title form-control ', id: 'title', value: (data.length==0)?'':data[0]['title'], placeholder: '', require: false, disabled: false, check: true, event: 'onchange=titleChangeToSlug() onkeyup=titleChangeToSlug()' },
            { title: 'Slug', type: 'text', col: 6, class: 'slug form-control ', id: 'slug', value: (data.length==0)?'':data[0]['slug'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Loại', type: 'select', col: 6, class: 'type form-control ', id: 'type', array: this.typeList(), require: false, disabled: false, check: false, event: 'onchange=getListType()' },
            { title: 'Danh Mục Cha', type: 'select', col: 6, class: 'type form-control ', id: 'parentID', array: [], require: false, disabled: false, check: false, event: '' },
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
        const array = await this.dataCommon(this.title, {'created': 1})
        return Html.tbody(this.recursiveTable(array))
    }

    async listType(){
        const {type} = this.req.body;
        const getListType = await Category_Models.getListType(type);
        let str = '<option value="">__Chọn__</option>';
        str += this.recursiveSelect(getListType);
        this.res.send({data: str})
    }
}
module.exports = Category_Controllers