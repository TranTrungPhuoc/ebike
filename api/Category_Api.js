const Api = require('../helpers/Api')
const Category_Models = require('../models/Category_Models')
class Category_Api extends Api{
    constructor(req, res){
        super(req, res)
    }

    async getItemsNews(){
        const { type, limit } = this.req.query
        const data = await Category_Models.getItemsNews(type, parseInt(limit));
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }

    async getItemsHome(){
        const { type, limit } = this.req.query
        const data = await Category_Models.getItemsHome(type, parseInt(limit));
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }

    async getItemsDetail(){
        const { slug } = this.req.params
        const data = await Category_Models.getItemsDetail(slug);
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }

    async getViewMore(){
        const { slug } = this.req.params
        const data = await Category_Models.getItemsDetail(slug);
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }

    async getItemsHomeDetail(){
        const { slug } = this.req.params
        const data = await Category_Models.getItemsDetail(slug);
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }
}

module.exports = Category_Api