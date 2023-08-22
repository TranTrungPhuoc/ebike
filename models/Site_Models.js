const Models = require('../helpers/Models')
const Schema = require('../schemas/Site_Schema')
class Site_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
}
module.exports = new Site_Models