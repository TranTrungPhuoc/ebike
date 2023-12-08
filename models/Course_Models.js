const Models = require('../helpers/Models')
const Schema = require('../schemas/Course_Schema')
class Course_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
    async getListApi(){
        return await this.table.aggregate([
            {$match: {} },
            {$sort: {created: -1}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'userID',
                    foreignField: '_id',
                    pipeline: [
                        {$project: { email: true, avatar: true, description: true }}
                    ],
                    as: 'user'
                }
            },
            {
                $project:{
                    parentID: false,
                    userID: false,
                    updated: false,
                    __v: false
                }
            }
        ]).exec()
    }
    async createApi(body){
        return await this.table.create(body);
    }
}
module.exports = new Course_Models