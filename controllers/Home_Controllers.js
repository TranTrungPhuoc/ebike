const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const Home_Models = require('../models/Home_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
const Convert=require('../helpers/Convert')
class Home_Controllers extends Controllers{
    
    constructor(req, res){
        super(req, res)
        this.model = Home_Models
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

    sectionList(){
        return [
            {value: 'part1', name: 'Phần 1'},
            {value: 'part2', name: 'Phần 2'},
            {value: 'part3', name: 'Phần 3'},
            {value: 'part4', name: 'Phần 4'},
            {value: 'part5', name: 'Phần 5'},
            {value: 'part6', name: 'Phần 6'}
        ]
    }

    topicList(){
        return [
            {value: 'category', name: 'Danh Mục'},
            {value: 'share', name: 'Chia Sẻ Kèo'},
            {value: 'course', name: 'Khóa Học'}
        ]
    }

    valueList(){
        return []
    }

    async formList(data){
        return [
            { title: 'Tiêu Đề', type: 'text', col: 4, class: 'title form-control ', id: 'title', value: (data.length==0)?'':data[0]['title'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Icon', type: 'text', col: 4, class: 'icon form-control ', id: 'icon', value: (data.length==0)?'':data[0]['icon'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Loại', type: 'select', col: 4, class: 'type form-control ', id: 'type', array: this.sectionList(), require: false, disabled: false, check: false, event: '' },
            { title: 'Chủ Đề', type: 'select', col: 4, class: 'topic form-control ', id: 'topic', array: this.topicList(), require: false, disabled: false, check: false, event: '' },
            { title: 'Giá Trị', type: 'select', col: 4, class: 'value form-control ', id: 'value', array: this.valueList(), require: false, disabled: false, check: false, event: '' },
        ]
    }

    theadList(){
        return [
            {title: 'Tiêu Đề', class:'', width: ''},
            {title: 'Loại Phần', class: 'text-center', width: '10%'},
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
module.exports = Home_Controllers