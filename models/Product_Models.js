const Models = require('../helpers/Models')
const Schema = require('../schemas/Product_Schema')
const Category_Model = require('../schemas/Category_Schema')
const mongoose = require('mongoose');
class Product_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
    async m_home(){
        const data = await this.table.find().select('title slug price avatar').sort({created: -1}).limit(20).exec();
        return data;
    }
    async getRelative(slug){
        const Product = await this.table.find({slug}).exec();
        if(Product.length > 0){
            return await Category_Model.aggregate([
                {$match: {_id: Product[0].parentID} },
                {$sort: {created: -1}},
                {
                    $lookup: {
                        from: 'Products',
                        localField: '_id',
                        foreignField: 'parentID',
                        pipeline: [
                            {$match: {slug: {$ne: slug}}},
                            {$sort: {created: -1}},
                            {$limit: 7},
                            {$project: { title: true, slug: true, avatar: true, description: true, created: true }}
                        ],
                        as: 'Products'
                    }
                },
                {
                    $project:{
                        title: true,
                        slug: true,
                        Products: true
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
                        {
                            $lookup: {
                                from: 'categories',
                                localField: 'parentID',
                                foreignField: '_id',
                                pipeline: [
                                    {$project: { title: true, slug: true }}
                                ],
                                as: 'categoryParent'
                            }
                        },
                        {$project: { title: true, slug: true, categoryParent: true }}
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
                        {$project: { email: true, avatar: true, description: true }}
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
    async check(id){
        return await this.table.find({_id: new mongoose.Types.ObjectId(id)}).exec()
    }
    async view(id, view){
        await this.table.updateMany(
            { _id: new mongoose.Types.ObjectId(id) },
            { view, updated: new Date() }
        )
        return await this.table.find({
            _id: new mongoose.Types.ObjectId(id)
        }).exec()
    }
    async search(key, page, limit){
        return await this.table.aggregate([
            {$match: {title: { '$regex': key, '$options': 'i' }} },
            { $sort: {created: -1} },
            { $skip: page },
            { $limit: limit },
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
                        {$project: { email: true, avatar: true, description: true }}
                    ],
                    as: 'user'
                }
            },
            {
                $project:{
                    content: false,
                    parentID: false,
                    userID: false,
                    __v: false
                }
            }
        ]).exec()
    }
}
module.exports = new Product_Models