const Models = require('../helpers/Models')
const Schema = require('../schemas/Post_Schema')
class Post_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
}
module.exports = new Post_Models