const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const Product_Models = require('../models/Product_Models')
const Category_Models = require('../models/Category_Models')
const Color_Models = require('../models/Color_Models')
const Pin_Models = require('../models/Pin_Models')
const User_Models = require('../models/User_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
const Convert=require('../helpers/Convert')
const mongoose = require('mongoose');
class Product_Controllers extends Controllers{
    
    constructor(req, res){
        super(req, res)
        this.model = Product_Models
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

    async category(){
        const array=await Category_Models.getFull({status: true, type: 'product-cate'}, 'title parentID')
        let str = '<option value="">__Chọn__</option>';
        if(this.params(2) == 'add'){
            str += this.recursiveSelect(array);
        }else{
            const data = await this.model.getDetail({ _id: new mongoose.Types.ObjectId(this.params(4))})
            str += this.recursiveSelect(array, '', '', 'parentID', 'title', '_id', (data.length>0?data[0]['parentID']:''));
        }
        return str;
    }

    async color(oldArray=[]){
        const array = await Color_Models.m_getList();
        return this.arrCheckbox(array, 'Color', oldArray);
    }

    async pin(oldArray=[]){
        const array = await Pin_Models.m_getList();
        return this.arrCheckbox(array, 'Pin', oldArray);
    }

    async formList(data){
        return [
            { title: 'Tiêu Đề', type: 'text', col: 6, class: 'title form-control ', id: 'title', value: (data.length==0)?'':data[0]['title'], placeholder: '', require: false, disabled: false, check: true, event: 'onchange=titleChangeToSlug() onkeyup=titleChangeToSlug()' },
            { title: 'Slug', type: 'text', col: 6, class: 'slug form-control ', id: 'slug', value: (data.length==0)?'':data[0]['slug'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Danh Mục', type: 'select', col: 6, class: 'parentID form-control ', id: 'parentID', array: await this.category(), require: false, disabled: false, check: false, event: '' },
            { title: 'Giá', type: 'number', col: 6, class: 'price form-control ', id: 'price', value: (data.length==0)?'':data[0]['price'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Màu sắc', type: 'checkbox', col: 6, class: 'color form-control ', id: 'color', array: await this.color((data.length==0)?[]:data[0]['color']), value: '', placeholder: '', row: 3, check: false },
            { title: 'Pin', type: 'checkbox', col: 6, class: 'pin form-control ', id: 'pin', array: await this.pin((data.length==0)?[]:data[0]['pin']), value: '', placeholder: '', row: 3, check: false },
            { title: 'Mô tả', type: 'textarea', col: 12, class: 'description form-control ', id: 'description', value: (data.length==0)?'':data[0]['description'], placeholder: '', row: 2, check: false },
            { title: 'Nội Dung', type: 'ckeditor', col: 12, class: 'content form-control ', id: 'content', value: (data.length==0)?'':data[0]['content'], placeholder: '', row: 3, check: false },
            { title: 'Video', type: 'ckeditor', col: 12, class: 'video form-control ', id: 'video', value: (data.length==0)?'':data[0]['video'], placeholder: '', row: 3, check: false },
            { title: 'Hình Ảnh', type: 'ckeditor', col: 12, class: 'realImage form-control ', id: 'realImage', value: (data.length==0)?'':data[0]['realImage'], placeholder: '', row: 3, check: false },
            { title: 'Thông Số Kỹ Thuật', type: 'ckeditor', col: 12, class: 'specifications form-control ', id: 'specifications', value: (data.length==0)?'':data[0]['specifications'], placeholder: '', row: 3, check: false },
            { title: 'Meta Title', type: 'text', col: 6, class: 'metaTitle form-control ', id: 'metaTitle', value: (data.length==0)?'':data[0]['metaTitle'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Canonical', type: 'text', col: 6, class: 'canonical form-control ', id: 'canonical', value: (data.length==0)?'':data[0]['canonical'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Meta Description', type: 'textarea', col: 12, class: 'metaDescription form-control ', id: 'metaDescription', value: (data.length==0)?'':data[0]['metaDescription'], placeholder: '', row: 2, check: false },
        ]
    }

    theadList(){
        return [
            {title: 'Avatar', class:'text-center', width: '5%'},
            {title: 'Tiêu Đề', class:'', width: ''},
            {title: 'Danh Mục', class: 'text-center', width: '10%'},
            {title: 'Ngày Tạo', class: 'text-center', width: '10%'},
            {title: 'Người Tạo', class: 'text-center', width: '5%'},
            {title: 'Nổi Bật', class: 'text-center', width: '5%'},
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
            const category = await Category_Models.getDetail({_id: element['parentID']})
            td+=this.tdImage(element['avatar']!=''?'/uploads/'+this.params(2)+'/'+element['avatar']:'/assets/images/photrader.png',element['_id'])
            td+=Html.td(Html.a(element[this.title], 'https://xedienvui.vn/' + element['slug'] + '.html', 'nav-link', '_blank'), ' align-middle')
            td+=this.tdType(category[0]!=undefined?category[0][this.title]:'')
            td+=this.tdDate(element['created'])
            td+=this.tdUser(user[0]['email'].split('@')[0])
            td+=this.tdFloat(element['_id'], element['float'])
            td+=this.tdStatus(element['_id'], element['status'])
            td+=this.tdFunction(element['_id'], this.params(2), element[this.title])
            tr+=Html.tr(td,element['_id'])
        }
        return Html.tbody(tr)
    }

}
module.exports = Product_Controllers