const Models = require('../helpers/Models')
const Schema = require('../schemas/Share_Schema')
class Share_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
}
module.exports = new Share_Models