const Api = require('../helpers/Api')
const Category_Models = require('../models/Category_Models')
class Category_Api extends Api{
    constructor(req, res){
        super(req, res)
    }

    async categoryHome(){
        const data = await Category_Models.m_categoryHome();
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }

    async menuCategory(){
        const data = await Category_Models.m_menuCategory();
        let response = this.recursive(data);
        response.push({
            title: 'Liên Hệ',
            slug: 'contact',
            childs: []
        })
        return this.res.send({
            code: 200,
            message: "Success",
            response
        })
    }

    async getItemsNews(){
        const { type, limit } = this.req.query
        const data = await Category_Models.getItemsNews(type, parseInt(limit??10));
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            for (let j = 0; j < element['Posts'].length; j++) {
                const element2 = element['Posts'][j];
                element2['avatar'] = element2['avatar']!=''?this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element2['avatar']:'';
            }
        }
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }

    async getItemsHome(){
        const { type, limit, sort } = this.req.query
        const limitDefault = parseInt(limit??10)
        const data = await Category_Models.getItemsHome(type, limitDefault, sort?parseInt(sort):1);
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            for (let j = 0; j < element['Posts'].length; j++) {
                const element2 = element['Posts'][j];
                element2['avatar'] = element2['avatar']!=''?this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element2['avatar']:'';
            }
        }
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }

    async getItemsRelative(){
        const { slug } = this.req.params
        const { type, limit } = this.req.query
        const limitDefault = parseInt(limit??20)
        const data = await Category_Models.getItemsRelative(type, slug, limitDefault);
        const response = []
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            for (let j = 0; j < element['Posts'].length; j++) {
                const element2 = element['Posts'][j];
                element2['avatar'] = element2['avatar']!=''?this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element2['avatar']:'';
            }
            response.push(...element['Posts'])
        }
        return this.res.send({
            code: 200,
            message: "Success",
            response
        })
    }

    async getItemsDetail(){
        const { slug } = this.req.params
        const { page, limit } = this.req.query
        const pageDefault = parseInt(page?(page==1?0:page):0)
        const limitDefault = parseInt(limit??12)
        const data = await Category_Models.getItemsDetail(slug, pageDefault, limitDefault);
        let count = 0;
        if(data.length>0){
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                for (let j = 0; j < element['Products'].length; j++) {
                    const element2 = element['Products'][j];
                    // element2['avatar'] = element2['avatar']!=''?this.req.protocol + '://' + this.req.headers.host + '/uploads/product/' + element2['avatar']:'';
                }
            }
            count = await Category_Models.getTotalItemsDetail(data[0]._id)
        }
        return this.res.send({
            code: 200,
            message: "Success",
            response: { total: count, page: pageDefault, limit: limitDefault, listData:data}
        })
    }

    async getViewMore(){
        const { slug } = this.req.params
        const data = await Category_Models.getItemsDetail(slug);
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            for (let j = 0; j < element['Posts'].length; j++) {
                const element2 = element['Posts'][j];
                element2['avatar'] = element2['avatar']!=''?this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element2['avatar']:'';
            }
        }
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }

    async getItemsHomeDetail(){
        const { slug } = this.req.params
        const data = await Category_Models.getItemsDetail(slug);
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            for (let j = 0; j < element['Posts'].length; j++) {
                const element2 = element['Posts'][j];
                element2['avatar'] = element2['avatar']!=''?this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element2['avatar']:'';
            }
        }
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }
}

module.exports = Category_Api