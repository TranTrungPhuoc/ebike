const Models = require('../helpers/Models')
const Schema = require('../schemas/Menu_Schema')
class Menu_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
    async getListLayout(location){
        const total = await this.table.find({location}).exec()
        const data = await this.table.find({location}).sort({sort: 1}).exec()
        return {data, total};
    }
}
module.exports = new Menu_Models