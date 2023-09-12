const Models = require('../helpers/Models')
const Schema = require('../schemas/Post_Schema')
const Category_Model = require('../schemas/Category_Schema')
class Post_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
    async getRelative(slug){
        const post = await this.table.find({slug}).exec();
        if(post.length > 0){
            return await Category_Model.aggregate([
                {$match: {_id: post[0].parentID} },
                {$sort: {created: -1}},
                {
                    $lookup: {
                        from: 'posts',
                        localField: '_id',
                        foreignField: 'parentID',
                        pipeline: [
                            {$match: {slug: {$ne: slug}}},
                            {$sort: {created: -1}},
                            {$limit: 7},
                            {$project: { title: true, slug: true, avatar: true, description: true }}
                        ],
                        as: 'Posts'
                    }
                },
                {
                    $project:{
                        title: true,
                        slug: true,
                        Posts: true
                    }
                }
            ]).exec()
        }else{
            return []
        }
    }
    async viewMore(limit){
        return await this.table.aggregate([
            {$match: {status: true}},
            {$sort:{view: -1}},
            {$limit: limit},
            {$project:{
                title: true,
                slug: true,
                avatar: true
            }}
        ]).exec()
    }
    async feature(){
        return await this.table.aggregate([
            {$match: {status: true, float: true}},
            {$sort:{_id: -1}},
            {$limit: 6},
            {
                $lookup:
                {
                    from: 'categories',
                    localField: 'parentID',
                    foreignField: '_id',
                    pipeline: [
                        {$project: { title: true, slug: true }}
                    ],
                    as: 'Category'
                }
            },
            {$project:{
                title: true,
                slug: true,
                avatar: true,
                status: true,
                float: true,
                Category: true,
            }}
        ]).exec()
    }
    async getDetailSlug(slug){
        return await this.table.aggregate([
            {$match: {slug} },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'parentID',
                    foreignField: '_id',
                    pipeline: [
                        {$project: { title: true, slug: true }}
                    ],
                    as: 'category'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userID',
                    foreignField: '_id',
                    pipeline: [
                        {$project: { email: true }}
                    ],
                    as: 'user'
                }
            },
            {
                $project:{
                    parentID: false,
                    userID: false,
                    __v: false
                }
            }
        ]).exec()
    }
}
module.exports = new Post_Models