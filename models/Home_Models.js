const Models = require('../helpers/Models')
const Schema = require('../schemas/Home_Schema')
class Home_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
}
module.exports = new Home_Models