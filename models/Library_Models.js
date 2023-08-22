const Models = require('../helpers/Models')
const Schema = require('../schemas/Library_Schema')
class Library_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
}
module.exports = new Library_Models