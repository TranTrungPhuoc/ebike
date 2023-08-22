const Models = require('../helpers/Models')
const Schema = require('../schemas/Menu_Schema')
class Menu_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
}
module.exports = new Menu_Models