const Api = require('../helpers/Api')
const Post_Models = require('../models/Post_Models')
const cheerio = require('cheerio');
class Post_Api extends Api {
    constructor(req, res) {
        super(req, res)
    }
    async getRelative() {
        const { slug } = this.req.params
        if (slug == undefined || slug.trim() == '') {
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

        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            for (let j = 0; j < element['Posts'].length; j++) {
                const element2 = element['Posts'][j];
                element2['avatar'] = element2['avatar'] != '' ? this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element2['avatar'] : '';
            }
        }

        this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }
    async viewMore() {
        let { limit } = this.req.query
        const data = await Post_Models.viewMore(limit != undefined ? parseInt(limit) : 10)

        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            element['avatar'] = element['avatar'] != '' ? this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element['avatar'] : '';
        }

        this.res.send({
            code: 200,
            message: "Success",
            response: { data }
        })
    }
    async feature() {
        const data = await Post_Models.feature()

        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            element['avatar'] = element['avatar'] != '' ? this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element['avatar'] : '';
        }

        const one = []
        const two = []
        const three = []

        for (let i = 0; i < data.length; i++) {
            if (i == 0 || i == 1) one.push(data[i])
            if (i == 2 || i == 3) two.push(data[i])
            if (i == 4 || i == 5) three.push(data[i])
        }

        for (let j = 0; j < one.length; j++) {
            one[j]['childs'] = (j == 0) ? two : three
        }

        this.res.send({
            code: 200,
            message: "Success",
            response: { data: one }
        })
    }
    titleChangeToSlug(title) {
        let slug;
        slug = title.toLowerCase();
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
        slug = slug.replace(/ /gi, "-");
        slug = slug.replace(/\-\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-/gi, '-');
        slug = slug.replace(/\-\-/gi, '-');
        slug = '@' + slug + '@';
        slug = slug.replace(/\@\-|\-\@|\@/gi, '');
        return slug;
    }
    async getDetailSlug() {
        const { slug } = this.req.params
        if (slug == undefined || slug.trim() == '') {
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

        this.res.send({data})
        return

        data[0]['avatar'] = data[0]['avatar'] != '' ? this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + data[0]['avatar'] : '';

        if(data[0]['user'].length > 0){
            data[0]['user'][0]['avatar'] = data[0]['user'][0]['avatar'] != '' ? this.req.protocol + '://' + this.req.headers.host + '/uploads/user/' + data[0]['user'][0]['avatar'] : '';
        }

        const $ = cheerio.load(data[0]['content']);
        let index = '';
        $('h2, h3, h4').each((i, element) => {
            const text = $(element).text();
            const idValue = this.titleChangeToSlug(text);
            $(element).attr('id', idValue);
            index+='<div class="index-'+element.tagName+'">';
            index+='<a href="#'+idValue+'">'+text+'</a></div>';
        })

        data[0]['content'] = data[0]['content'] != '' ? $('body').html(): '';

        data[0]['index'] = index;

        data[0]['user'] = data[0]['user'][0];

        this.res.send({
            code: 200,
            message: "Success",
            response: data[0]
        })
    }
    async view() {
        const ObjectId = require('mongoose').Types.ObjectId;

        if (ObjectId.isValid(this.req.params.id) == false) {
            this.res.send({
                code: 600,
                message: "Error",
                response: {
                    error: "Id không đúng."
                }
            })
            return
        }

        const check_exist_db = await Post_Models.check(this.req.params.id);
        if (check_exist_db.length == 0) {
            this.res.send({
                code: 602,
                message: "Error",
                response: {
                    error: "Dữ liệu không tồn tại."
                }
            })
            return
        }

        const data = await Post_Models.view(this.req.params.id, check_exist_db[0].view + 1)

        data[0]['avatar'] = data[0]['avatar'] != '' ? this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + data[0]['avatar'] : '';

        this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }
    async search() {
        const { key, page, limit } = this.req.query
        const data = await Post_Models.search(key, parseInt(page ? (page == 1 ? 0 : page) : 0), parseInt(limit ?? 10))
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            element['avatar'] = element['avatar'] != '' ? this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element['avatar'] : '';
        }
        this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }
}

module.exports = Post_Api