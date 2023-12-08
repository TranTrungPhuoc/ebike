const Models = require('../helpers/Models')
const Schema = require('../schemas/Site_Schema')
class Site_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }

    getList(){
        return this.table.find().exec();
    }
}
module.exports = new Site_Models