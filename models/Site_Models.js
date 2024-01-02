const Models = require('../helpers/Models')
const Schema = require('../schemas/Site_Schema')
const Province = require('../schemas/Province_Schema')
const District = require('../schemas/District_Schema')
const Wards = require('../schemas/Wards_Schema')
class Site_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }

    getList(){
        return this.table.find().exec();
    }

    provinceList(){
        return Province.find({}).exec();
    }

    districtList(citycode=''){
        return District.find({citycode}).exec();
    }

    wardsList(districtcode=''){
        return Wards.find({districtcode}).exec();
    }
}
module.exports = new Site_Models