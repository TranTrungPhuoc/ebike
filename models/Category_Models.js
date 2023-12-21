const { default: mongoose } = require('mongoose')
const Models = require('../helpers/Models')
const Schema = require('../schemas/Category_Schema')
const Post_Schema = require('../schemas/Post_Schema')
const Product_Schema = require('../schemas/Product_Schema')
class Category_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }

    async m_categoryHome(){
        return await this.table.find({status: true, type: 'sanpham', float: true}).select('title slug avatar').exec();
    }

    async m_menuCategory(){
        return await this.table.find({status: true}).select('title slug type parentID').exec();
    }

    // async m_getID(slug){
    //     const father = await this.table.find(slug).select('_id').exec();

    //     const childOne = await this.table.find({
    //         parentID: father[0]['_id']
    //     }).select('_id').exec();

    //     console.log(childOne);

    //     return 0;
    // }

    async getListType(type){
        return await this.table.find({type}).select('title parentID').exec();
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
                            price: true,
                            linkRegister: true,
                            created: true 
                        }}
                    ],
                    as: 'Posts'
                }
            },
            {$project: { title: true, slug: true, Posts: true }}
        ])
    }

    async getItemsHome(type, limit, sort){
        return await this.table.aggregate([
            { $match: {type, status: true} },
            { $sort: {_id: sort} },
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

    async getItemsRelative(type, slug, limit){
        return await this.table.aggregate([
            { $match: {type, status: true, slug: {$ne: slug}} },
            {
                $lookup:
                {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'parentID',
                    pipeline: [
                        { $match: {status: true} },
                        { $sort: {view: -1} },
                        { $limit: parseInt(limit) },
                        { $project: { 
                            title: true, 
                            slug: true, 
                            video: true, 
                            avatar: true, 
                            view: true, 
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

    async getIDs(slug){
        const father = await this.table.find({slug}).select('_id').exec();

        const arrayID = [father[0]['_id']];
        const childOne = await this.table.find({
            parentID: father[0]['_id']
        }).select('_id').exec();

        if(childOne.length > 0){
            const arrayIDChildOne = []
            for (let index = 0; index < childOne.length; index++) {
                const element = childOne[index];
                arrayIDChildOne.push(element._id)
            }
            arrayID.push(...arrayIDChildOne)

            const childTwo = await this.table.find({
                parentID: {$in: arrayIDChildOne}
            }).select('_id').exec();

            if(childTwo.length > 0){
                const arrayIDChildTwo = []
                for (let index = 0; index < childTwo.length; index++) {
                    const element = childTwo[index];
                    arrayIDChildTwo.push(element._id)
                }
                arrayID.push(...arrayIDChildTwo)
            }
        }

        return arrayID;
    }

    async getItemsDetail(slug, page, limit){
        const arrayID = await this.getIDs(slug)
        const category = await this.table.find({slug}).select('title slug type content').exec();
        const skip = page>1?((page-1)*limit):1
        const select = 'title slug avatar description price created'
        const products = await Product_Schema.find({parentID: {$in: arrayID} }).sort({created: -1}).skip(skip).limit(limit).select(select).exec();
        return {category: category[0], products}
    }

    async getTotalItemsDetail(slug){
        const arrayID = await this.getIDs(slug);
        return await Product_Schema.countDocuments({
            parentID: {$in: arrayID}
        }).exec();
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