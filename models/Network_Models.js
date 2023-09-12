const Models = require('../helpers/Models')
const Schema = require('../schemas/Network_Schema')
class Network_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
    async getSocialNetwork(location){
        return await this.table.find({status: true, location}).sort({sort: 1}).select('title svg link location');
    }
}
module.exports = new Network_Models