const Models = require('../helpers/Models')
const Schema = require('../schemas/Network_Schema')
class Network_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
}
module.exports = new Network_Models