const Models = require('../helpers/Models')
const Schema = require('../schemas/Category_Schema')
class Category_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }

    async getItemsNews(type, limit){
        return await this.table.aggregate([
            { $match: {type, status: true} },
            {
                $lookup:
                {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'parentID',
                    pipeline: [
                        { $match: {status: true} },
                        { $sort: {created: -1} },
                        { $limit: limit },
                        { $project: { 
                            title: true, 
                            slug: true, 
                            avatar: true, 
                            description: true,
                            created: true 
                        }}
                    ],
                    as: 'Posts'
                }
            },
            {$project: { title: true, slug: true, Posts: true }}
        ])
    }

    async getItemsHome(type, limit){
        return await this.table.aggregate([
            { $match: {type, status: true} },
            {
                $lookup:
                {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'parentID',
                    pipeline: [
                        { $match: {status: true} },
                        { $sort: {created: -1} },
                        { $limit: parseInt(limit) },
                        { $project: { 
                            title: true, 
                            slug: true, 
                            video: true, 
                            avatar: true, 
                            view: true, 
                            description: true 
                        }}
                    ],
                    as: 'Posts'
                }
            },
            {$project: { title: true, slug: true, Posts: true }}
        ])
    }

    async getItemsDetail(slug){
        return await this.table.aggregate([
            { $match: {slug} },
            {
                $lookup:
                {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'parentID',
                    pipeline: [
                        {$sort: {created: -1}},
                        {$project: { title: true, slug: true, avatar: true, description: true }}
                    ],
                    as: 'Posts'
                }
            },
            {$project: { title: true, slug: true, Posts: true }}
        ])
    }

    async getViewMore(slug){
        return await this.table.aggregate([
            { $match: {slug} },
            {
                $lookup:
                {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'parentID',
                    pipeline: [
                        {$sort: {view: -1}},
                        {$limit: 7},
                        {$project: { title: true, slug: true, avatar: true, description: true }}
                    ],
                    as: 'Posts'
                }
            },
            {$project: { title: true, slug: true, Posts: true }}
        ])
    }

    async getItemsHomeDetail(slug){
        return await this.table.aggregate([
            { $match: {type: slug} },
            {
                $lookup:
                {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'parentID',
                    pipeline: [
                        {$match: {float: true}},
                        {$sort: {created: -1}},
                        {$limit: 1},
                        {$project: { title: true, slug: true, avatar: true, description: true }}
                    ],
                    as: 'Posts'
                }
            },
            {$project: { title: true, slug: true, Posts: true }}
        ])
    }
}
module.exports = new Category_Models