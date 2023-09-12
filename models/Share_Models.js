const Models = require('../helpers/Models')
const Schema = require('../schemas/Share_Schema')
class Share_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
    async getItemsHome(limit){
        return await this.table
        .aggregate([
            {$match: {status: true}},
            {$sort:{created: -1}},
            {$limit: limit}
        ]).exec()
    }
}
module.exports = new Share_Models