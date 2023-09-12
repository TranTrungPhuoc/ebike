const Api = require('../helpers/Api')
const Post_Models = require('../models/Post_Models')
class Post_Api extends Api{
    constructor(req, res){
        super(req, res)
    }
    async getRelative(){
        const {slug} = this.req.params
        if(slug == undefined || slug.trim() == ''){
            this.res.send({
                code: 600,
                message: "Success",
                response: {
                    error: "Slug không được rỗng."
                }
            })
            return
        }
        const data = await Post_Models.getRelative(slug.trim())
        this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }
    async viewMore(){
        let { limit } = this.req.query
        const data = await Post_Models.viewMore(limit!=undefined?parseInt(limit):10)
        this.res.send({
            code: 200,
            message: "Success",
            response: { data }
        })
    }
    async feature(){
        const data = await Post_Models.feature()

        const one = []
        const two = []
        const three = []

        for (let i = 0; i < data.length; i++) {
            if(i == 0 || i == 1) one.push(data[i])
            if(i == 2 || i == 3) two.push(data[i])
            if(i == 4 || i == 5) three.push(data[i])
        }

        for (let j = 0; j < one.length; j++) {
            one[j]['childs'] = (j==0) ? two : three
        }

        this.res.send({
            code: 200,
            message: "Success",
            response: { data: one }
        })
    }
    async getDetailSlug(){
        const {slug} = this.req.params
        if(slug == undefined || slug.trim() == ''){
            res.send({
                code: 600,
                message: "Success",
                response: {
                    error: "Slug không được rỗng."
                }
            })
            return
        }
        const data = await Post_Models.getDetailSlug(slug.trim())
        this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }
}

module.exports = Post_Api