const Models = require('../helpers/Models')
const Schema = require('../schemas/Course_Schema')
class Course_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
}
module.exports = new Course_Models