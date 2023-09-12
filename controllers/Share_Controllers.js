const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const Share_Models = require('../models/Share_Models')
const User_Models = require('../models/User_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
const Convert=require('../helpers/Convert')
class Share_Controllers extends Controllers{
    
    constructor(req, res){
        super(req, res)
        this.model = Share_Models
        this.title = 'command'
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

    resultList(){
        return [
            {value: 'win', name: 'Win'},
            {value: 'lost', name: 'Lost'},
            {value: 'pending', name: 'Pending'}
        ];
    }

    makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    async formList(data){
        return [
            { title: 'Mã', type: 'hidden', col: 6, class: 'code form-control ', id: 'code', value: (data.length==0)?'PTD-'+this.makeid(5):data[0]['code'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Lệnh', type: 'text', col: 4, class: 'command form-control ', id: 'command', value: (data.length==0)?'':data[0]['command'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Entry', type: 'text', col: 4, class: 'entry form-control ', id: 'entry', value: (data.length==0)?'':data[0]['entry'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Sl', type: 'text', col: 4, class: 'sl form-control ', id: 'sl', value: (data.length==0)?'':data[0]['sl'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Tp', type: 'text', col: 4, class: 'tp form-control ', id: 'tp', value: (data.length==0)?'':data[0]['tp'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Link', type: 'text', col: 4, class: 'link form-control ', id: 'link', value: (data.length==0)?'':data[0]['link'], placeholder: '', require: false, disabled: false, check: false, event: '' },
            { title: 'Kết quả', type: 'select', col: 4, class: 'result form-control ', id: 'result', array: this.resultList(), require: false, disabled: false, check: false, event: '' },
            { title: 'Mô tả', type: 'textarea', col: 12, class: 'description form-control ', id: 'description', value: (data.length==0)?'':data[0]['description'], placeholder: '', row: 3, check: false },
        ]
    }

    theadList(){
        return [
            {title: 'Avatar', class:'text-center', width: '5%'},
            {title: 'Lệnh', class:'text-center', width: ''},
            {title: 'Entry', class: 'text-center', width: ''},
            {title: 'SL', class: 'text-center', width: ''},
            {title: 'TP', class: 'text-center', width: ''},
            {title: 'Kết Quả', class: 'text-center', width: ''},
            {title: 'Ngày Tạo', class: 'text-center', width: '10%'},
            {title: 'Người Tạo', class: 'text-center', width: '15%'},
            {title: 'Hiển Thị', class: 'text-center', width: '5%'},
            {title: 'Chức Năng', class: 'text-center', width: '10%'}
        ]
    }

    async tbodyList(){
        const array = await this.dataCommon(this.title, {'created': -1})
        let tr='';
        for (let index = 0; index < array.length; index++) {
            let td='';
            const element = array[index]
            const user = await User_Models.getDetail({_id:element['userID']})
            td+=this.tdImage(element['avatar']!=''?'/uploads/'+this.params(2)+'/'+element['avatar']:'/assets/images/photrader.jpeg',element['_id'])
            td+=Html.td(element[this.title], 'align-middle text-center')
            td+=Html.td(element['entry'], 'align-middle text-center')
            td+=Html.td(element['sl'], 'align-middle text-center')
            td+=Html.td(element['tp'], 'align-middle text-center')
            td+=this.tdType(element['result'])
            td+=this.tdDate(element['created'])
            td+=this.tdUser(user[0]['email'])
            td+=this.tdStatus(element['_id'], element['status'])
            td+=this.tdFunction(element['_id'], this.params(2), element[this.title])
            tr+=Html.tr(td,element['_id'])
        }
        return Html.tbody(tr)
    }

}
module.exports = Share_Controllers