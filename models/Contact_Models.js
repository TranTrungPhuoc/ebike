const Models = require('../helpers/Models')
const Schema = require('../schemas/Contact_Schema')
class Contact_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
    async m_insert(object){
        return await this.table.create(object);
    }
}
module.exports = new Contact_Models