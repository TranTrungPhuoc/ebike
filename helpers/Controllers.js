const Html = require('./Html')
const fs = require('fs');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const moment = require('moment');
const mongoose = require('mongoose');
const Validation = require('./Validatation')
const Convert = require('./Convert')

const User_Models = require('../models/User_Models')
const Post_Models = require('../models/Post_Models')
const Product_Models = require('../models/Product_Models')
const Category_Models = require('../models/Category_Models')
const Menu_Models = require('../models/Menu_Models')
const Share_Models = require('../models/Share_Models')
const Course_Models = require('../models/Course_Models')
const Library_Models = require('../models/Library_Models')
const Contact_Models = require('../models/Contact_Models')
const Network_Models = require('../models/Network_Models')

const axios = require('axios');

class Controllers {

    constructor(req, res) {
        this.req = req
        this.res = res
        this.module = this.params(2)
    }

    recursiveTable(
        array = [],
        initial = '',
        character = '',
        parentID = 'parentID',
        title = 'title',
        slug = 'slug',
        value = '_id',
        type = 'type'
    ) {
        const link = 'https://xedienvui.vn/';
        let tr = '';
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            const valueParentID = (element[parentID]) ?? '';
            if (valueParentID.toString() == initial.toString()) {
                let td = '';
                td+=this.tdImage(element['avatar']!=''?'/uploads/'+this.params(2)+'/'+element['avatar']:'/assets/images/photrader.png',element['_id'])
                td += Html.td(Html.a(character + element[title], link + element[slug], 'nav-link', '_blank'), ' align-middle')
                td += this.tdType(element[type])
                td += this.tdDate(element['created'])
                td +=this.tdFloat(element['_id'], element['float'])
                td += this.tdStatus(element[value], element['status'])
                td += this.tdFunction(element[value], this.params(2), element[title])
                tr += Html.tr(td, element[value])
                tr += this.recursiveTable(array, element[value], character + '|----- ')
            }
        }
        return tr;
    }

    recursiveSelect(
        array = [],
        initial = '',
        character = '',
        parentID = 'parentID',
        title = 'title',
        value = '_id',
        valueActive = ''
    ) {
        let str = '';
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            const selected = (valueActive && valueActive.toString() == element[value].toString()) ? 'selected' : '';
            const valueParentID = (element[parentID]) ?? '';
            if (valueParentID.toString() == initial.toString()) {
                str += '<option value="' + element[value] + '" ' + selected + '>' + character + element[title] + '</option>';
                str += this.recursiveSelect(array, element[value], character + '|----- ', parentID, title, value, valueActive)
            }
        }
        return str;
    }

    params(so) {
        return this.req.originalUrl.split('/')[so]
    }

    async addHtml() {
        let categorySelect = '';
        // if (this.module == 'post') {
        //     const array = await Category_Models.getList({}, '_id');
        //     const options = []
        //     for (let index = 0; index < array.length; index++) {
        //         const element = array[index];
        //         options.push({
        //             name: element['title'],
        //             value: element['_id']
        //         })
        //     }
        //     categorySelect = Html.form(Html.select(options, 'btn btn-outline-secondary has-ripple', 'parentID', this.req.query.parentID!=undefined?this.req.query.parentID.toString():'', ' onchange="this.form.submit()"', '__DanhMục__'), 'categoryForm');
        // }
        const addButton = Html.h5(Html.a(Html.icon('plus') + ' Thêm', '/admin/' + this.module + '/add', 'btn btn-outline-primary has-ripple'));
        return Html.div('col-md-8 d-flex', (this.params(2)!='order'&&this.params(2)!='customer')? addButton + categorySelect : '')
    }

    searchHtml() {
        return Html.div('col-md-4', Html.form(Html.div('input-group', Html.input('text', 'form-control', 'search', this.req.query.search, 'Tìm Kiếm')), 'formSearch'))
    }

    async pagination() {
        const sumData = await this.arrayFull()
        let li = '';
        if (sumData.length > 0) {
            let sumDataNew = sumData.length; //(sumData.length > 30) ? 30 : sumData.length;
            if (this.req.query.parentID != undefined || this.req.query.search != undefined) {
                sumDataNew = sumData.length
            }
            const page = this.getNumber(this.req.query.page, 1)
            const totalPage = (this.params(2)!='category')?Math.ceil(sumDataNew / process.env.LIMIT):1;
            li = Html.li(Html.a(Html.icon('chevrons-left'), 'index?page=' + (page - 1) + (this.req.query.search ? '&search=' + this.req.query.search : '') + (this.req.query.parentID ? '&parentID=' + this.req.query.parentID : ''), 'page-link'), 'paginate_button page-item previous' + (page == 1 ? ' disabled' : ''))
            for (let index = 1; index <= totalPage; index++) {
                li += Html.li(Html.a(index, '?page=' + index + (this.req.query.search ? '&search=' + this.req.query.search : '') + (this.req.query.parentID ? '&parentID=' + this.req.query.parentID : ''), 'page-link'), 'paginate_button page-item' + (page == index ? ' active' : ''))
            }
            li += Html.li(Html.a(Html.icon('chevrons-right'), 'index?page=' + (page + 1) + (this.req.query.search ? '&search=' + this.req.query.search : '') + (this.req.query.parentID ? '&parentID=' + this.req.query.parentID : ''), 'page-link'), 'paginate_button page-item next' + (page == totalPage ? ' disabled' : ''))
        }
        return Html.div('row', Html.div('col-sm-12', Html.div('dataTables_paginate paging_simple_numbers', Html.ul(li, 'pagination'))))
    }

    async headerContent() {
        return Html.div('card-header', Html.div('row', await this.addHtml() + ((this.params(2) != 'category') ? this.searchHtml() : '')))
    }

    async bodyContent() {
        return Html.div('card-body table-border-style', Html.div('table-responsive', Html.table(this.theadCommon(), await this.tbodyList())) + await this.pagination())
    }

    formContent(array) {
        const saveHTML = Html.submit('btn btn-outline-primary has-ripple', 'Lưu')
        let exitHTML = '';
        if (!this.req.originalUrl.includes('site') && !this.req.originalUrl.includes('mail')) {
            exitHTML = Html.a('Thoát', '/admin/' + this.module + '/index', 'btn btn-outline-secondary has-ripple')
        }
        return Html.div('card-body', Html.div('card-body', Html.form(Html.div('row', array) + Html.div('save', Html.div('mt-3', saveHTML + '&nbsp;' + exitHTML)) + Html.div('loading', '<br/>' + Html.spiner()))))
    }

    action() {
        return this.params(3).split('?')[0]
    }

    async content(array) {
        return Html.div('row', Html.div('col-xl-12', Html.div('card', (this.action() == 'index' ? (await this.headerContent() + await this.bodyContent()) : this.formContent(array)))))
    }

    breadcrumbHTML(str) {
        const title = Html.div('page-header-title', Html.h5(Convert.index(this.module), 'm-b-10'))
        const url = Html.ul(str, 'breadcrumb')
        return Html.div('page-header', Html.div('page-block', Html.div('row align-items-center', Html.div('col-md-12', title + url))))
    }

    breadcrumb() {
        const array = [
            { title: Html.icon('home'), link: 'dashboard' },
            { title: Convert.index(this.module), link: this.module },
            { title: (this.req.originalUrl.includes('index') ? 'Bảng Dữ Liệu' : 'Form'), link: '' }
        ]
        let str = '';
        for (let index = 0; index < array.length; index++) {
            str += Html.li(Html.a(array[index].title, array[index].link ? '/admin/' + array[index].link + '/index' : '', ''), 'breadcrumb-item');
        }
        return this.breadcrumbHTML(str)
    }

    async arrayAside() {
        const user = await User_Models.getFull({}, '_id')
        const post = await Post_Models.getFull({}, '_id')
        const menu = await Menu_Models.getFull({}, '_id')
        const share = await Share_Models.getFull({}, '_id')
        const course = await Course_Models.getFull({}, '_id')
        const library = await Library_Models.getFull({}, '_id')
        const contact = await Contact_Models.getFull({}, '_id')
        const network = await Network_Models.getFull({}, '_id')
        return [
            { title: "Danh Mục", link: "category", color: "yellow", count: user.length },
            { title: "Bài Viết", link: "post", color: "yellow", count: post.length },
            { title: "Menu", link: "menu", color: "yellow", count: menu.length },
            { title: "Chia Sẻ Kèo", link: "share", color: "green", count: share.length },
            { title: "Khóa Học", link: "course", color: "green", count: course.length },
            { title: "Thư Viện Ảnh", link: "library", color: "green", count: library.length },
            { title: "Liên Hệ", link: "contact", color: "blue", count: contact.length },
            { title: "Mạng Xã Hội", link: "network", color: "blue", count: network.length }
        ]
    }

    async arrayDashboard() {
        let array = await this.arrayAside()
        let str = '';
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            str += Html.div('col-sm-4',
                Html.div('card',
                    Html.div('card-body',
                        Html.div('row align-items-center',
                            Html.div('col-8',
                                Html.h4(element['count'], 'text-c-' + element['color'])
                                +
                                Html.h6('Tổng Dữ Liệu', 'text-muted m-b-0')
                            )
                            +
                            Html.div('col-4 text-end',
                                Html.icon('feather icon-bar-chart-2 f-28')
                            )
                        )
                    )
                    +
                    Html.div('card-footer bg-c-' + element['color'],
                        Html.div('row align-items-center',
                            Html.div('col-9',
                                Html.p('text-white m-b-0', element['title'])
                            )
                            +
                            Html.div('col-3 text-end',
                                Html.icon('feather icon-trending-up text-white f-16')
                            )
                        )
                    )
                )
            )
        }
        return str;
    }

    async dashboard() {
        return Html.div('row', await this.arrayDashboard());
    }

    async contentSite(){
        const data = await this.model.getList()
        const saveHTML = Html.submit('btn btn-outline-primary has-ripple', 'Lưu')
        let array = Html.h4('Cấu hình Chung') + '<hr />';
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Tên Công Ty', 'form-label') + Html.input('text', 'form-control', 'nameCompany', data[0]['nameCompany'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Hotline', 'form-label') + Html.input('text', 'form-control', 'hotlineCompany', data[0]['hotlineCompany'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('CSKH', 'form-label') + Html.input('text', 'form-control', 'cskhCompany', data[0]['cskhCompany'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Email', 'form-label') + Html.input('text', 'form-control', 'emailCompany', data[0]['emailCompany'])));

        array += Html.div('col-md-4', Html.div('form-group', Html.label('Slogan', 'form-label') + Html.input('text', 'form-control', 'slogan', data[0]['slogan'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Text bảo hành', 'form-label') + Html.input('text', 'form-control', 'textGuarantee', data[0]['textGuarantee'])));

        array += Html.div('col-md-6', Html.div('form-group', Html.label('ĐKKD/MST', 'form-label') + Html.input('text', 'form-control', 'mstCompany', data[0]['mstCompany'])));
        array += Html.div('col-md-6', Html.div('form-group', Html.label('Địa chỉ', 'form-label') + Html.input('text', 'form-control', 'addressCompany', data[0]['addressCompany'])));
        
        array += Html.p('mt-2', '<mark class="p-2 rounded-3 fw-bold">Button Xem Thêm</mark>')
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Tên', 'form-label') + Html.input('text', 'form-control', 'btnMoreText', data[0]['btnMoreText'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Link', 'form-label') + Html.input('text', 'form-control', 'btnMoreLink', data[0]['btnMoreLink'])));

        array += Html.p('mt-2', '<mark class="p-2 rounded-3 fw-bold">Button Hệ Thống Cửa Hàng</mark>')
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Tên', 'form-label') + Html.input('text', 'form-control', 'btnStoreText', data[0]['btnStoreText'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Link', 'form-label') + Html.input('text', 'form-control', 'btnStoreLink', data[0]['btnStoreLink'])));

        array += Html.h4('Cấu hình Header', 'mt-4') + '<hr />';

        // cột 1
        array += Html.p('mt-2', '<mark class="p-2 rounded-3 fw-bold">Column One</mark>')
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Class Icon', 'form-label') + Html.input('text', 'form-control', 'iconAddressHeader', data[0]['iconAddressHeader'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Tiêu Đề', 'form-label') + Html.input('text', 'form-control', 'titleAddressHeader', data[0]['titleAddressHeader'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Link', 'form-label') + Html.input('text', 'form-control', 'linkAddressHeader', data[0]['linkAddressHeader'])));

        // cột 2
        array += Html.p('mt-2', '<mark class="p-2 rounded-3 fw-bold">Column Two</mark>')
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Class Icon', 'form-label') + Html.input('text', 'form-control', 'iconPurchaseHeader', data[0]['iconPurchaseHeader'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Tiêu Đề', 'form-label') + Html.input('text', 'form-control', 'titlePurchaseHeader', data[0]['titlePurchaseHeader'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Link', 'form-label') + Html.input('text', 'form-control', 'linkPurchaseHeader', data[0]['linkPurchaseHeader'])));

        // cột 3
        array += Html.p('mt-2', '<mark class="p-2 rounded-3 fw-bold">Column Three</mark>')
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Class Icon', 'form-label') + Html.input('text', 'form-control', 'iconPhoneHeader', data[0]['iconPhoneHeader'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Tiêu Đề', 'form-label') + Html.input('text', 'form-control', 'titlePhoneHeader', data[0]['titlePhoneHeader'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Link', 'form-label') + Html.input('text', 'form-control', 'linkPhoneHeader', data[0]['linkPhoneHeader'])));

        // cột 4
        array += Html.p('mt-2', '<mark class="p-2 rounded-3 fw-bold">Column Four</mark>')
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Class Icon', 'form-label') + Html.input('text', 'form-control', 'iconFreeshipHeader', data[0]['iconFreeshipHeader'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Tiêu Đề', 'form-label') + Html.input('text', 'form-control', 'titleFreeshipHeader', data[0]['titleFreeshipHeader'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Link', 'form-label') + Html.input('text', 'form-control', 'linkFreeshipHeader', data[0]['linkFreeshipHeader'])));

        // cột 5
        array += Html.p('mt-2', '<mark class="p-2 rounded-3 fw-bold">Column Five</mark>')
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Class Icon', 'form-label') + Html.input('text', 'form-control', 'iconGuaranteeHeader', data[0]['iconGuaranteeHeader'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Tiêu Đề', 'form-label') + Html.input('text', 'form-control', 'titleGuaranteeHeader', data[0]['titleGuaranteeHeader'])));
        array += Html.div('col-md-4', Html.div('form-group', Html.label('Link', 'form-label') + Html.input('text', 'form-control', 'linkGuaranteeHeader', data[0]['linkGuaranteeHeader'])));

        array += Html.h4('Cấu hình Gửi Email', 'mt-4') + '<hr />';
        array += Html.div('col-md-6', Html.div('form-group', Html.label('Host', 'form-label') + Html.input('text', 'form-control', 'hostMail', data[0]['hostMail'])));
        array += Html.div('col-md-6', Html.div('form-group', Html.label('Port', 'form-label') + Html.input('text', 'form-control', 'portMail', data[0]['portMail'])));
        array += Html.div('col-md-6', Html.div('form-group', Html.label('Username', 'form-label') + Html.input('text', 'form-control', 'usernameMail', data[0]['usernameMail'])));
        array += Html.div('col-md-6', Html.div('form-group', Html.label('Password', 'form-label') + Html.input('password', 'form-control', 'passwordMail', data[0]['passwordMail'])));

        array += Html.h4('Cấu hình SEO', 'mt-4') + '<hr />';
        array += Html.div('col-md-6', Html.div('form-group', Html.label('Meta Title', 'form-label') + Html.input('text', 'form-control', 'titleSEO', data[0]['titleSEO'])));
        array += Html.div('col-md-6', Html.div('form-group', Html.label('Canonical', 'form-label') + Html.input('text', 'form-control', 'canonicalSEO', data[0]['canonicalSEO'])));
        array += Html.div('col-md-12', Html.div('form-group', Html.label('Meta Description', 'form-label') + Html.input('text', 'form-control', 'descriptionSEO', data[0]['descriptionSEO'])));

        const id = this.req.params['id']

        array += Html.input('hidden', '', 'idEdit', id)

        const main = Html.div('card-body', Html.div('card-body', Html.form(Html.div('row', array) + Html.div('save', Html.div('mt-3', saveHTML)) + Html.div('loading', '<br/>' + Html.spiner()))))
        return Html.div('row', Html.div('col-xl-12', Html.div('card', main)))
    }

    async main(array = []) {
        let content = await this.content(array)
        if (this.req.originalUrl.includes('dashboard')) {
            content = await this.dashboard(array)
        }
        return Html.section('pcoded-main-container', Html.div('pcoded-content', this.breadcrumb() + (this.params(2)!='site'?content:await this.contentSite())));
    }

    aside() {
        const array = JSON.parse(fs.readFileSync('aside.json')).data;
        let str = '';
        for (let index = 0; index < array.length; index++) {
            str += Html.li(Html.a(Html.span('pcoded-micon', Html.icon(array[index].icon)) + array[index].title, '/admin/' + array[index].link + '/' + array[index].home, 'nav-link has-ripple'), (this.params(2) == array[index].link ? 'nav-item active' : 'nav-item'));
        }
        return Html.ul(str)
    }

    async getAPI() {
        try {
            const response = await axios.get('https://api.triqhuynh.com/photrader/category/layout/detail/64b6e783189bcf8a9ae030ac');
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    async getPostApi() {
        const api = await this.getAPI()
        const _array = api['data']['response'][0]['Posts']
        const newArray = []
        for (let index = 0; index < _array.length; index++) {
            const element = _array[index];
            newArray.push({
                title: element['title'],
                slug: element['slug'],
                parentID: new mongoose.Types.ObjectId('64e4f9888a815b75f74432f4'),
                userID: new mongoose.Types.ObjectId('64de4ec67d334044461d019a'),
                description: element['description'],
                content: element['content'],
                float: element['float'],
                view: element['view'],
                video: element['video'],
                avatar: element['avatar']
            })
        }
        return await Post_Models.create(newArray)
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

    async index(array = []) {
        await this.res.render('index', { aside: this.aside(), module: this.module, main: await this.main(array), user: this.req.cookies.user[0] })
    }

    async formHTML(id) {
        const data = await this.model.getDetail({ _id: new mongoose.Types.ObjectId(id) })
        const array = await this.formList(data)
        let recursiveData = [];
        if (this.params(2) == 'category' && this.params(3) == 'edit') {
            const dataCategory = await Category_Models.getListType(data[0].type);
            recursiveData = this.recursiveSelect(dataCategory, '', '', 'parentID', 'title', '_id', data[0]['parentID']);
        }

        let str = '';
        for (let index = 0; index < array.length; index++) {
            let typeHtml = Html.input(array[index]['type'], array[index]['class'], array[index]['id'], array[index]['value'], array[index]['placeholder'], array[index]['require'], array[index]['disabled'], array[index]['event']);
            if (array[index]['type'] == 'textarea') {
                typeHtml = Html.textarea(array[index]['row'], array[index]['value'], array[index]['class'], array[index]['id'], array[index]['placeholder'])
            }
            else if (array[index]['type'] == 'select') {
                typeHtml = Html.select(array[index]['array'], array[index]['class'], array[index]['id'], (id != undefined) ? data[0][array[index]['id']] : '', array[index]['event'])
                if (
                    this.params(3) == 'edit' &&
                    this.params(2) == 'category' &&
                    array[index]['id'] == 'parentID'
                ) {
                    let str = '<select class="form-control" id="' + array[index]['id'] + '" name="' + array[index]['id'] + '" ' + array[index]['event'] + '>';
                    str += recursiveData;
                    str += '</select>';
                    typeHtml = str;
                } else if (this.params(2) == 'product' || this.params(2) == 'post') {
                    let str = '<select class="form-control" id="' + array[index]['id'] + '" name="' + array[index]['id'] + '" ' + array[index]['event'] + '>';
                    str += array[index]['array'];
                    str += '</select>';
                    typeHtml = str;
                }
            }
            else if (array[index]['type'] == 'ckeditor') {
                const uploadFile = Html.button('UploadFile', 'btn-outline-success has-ripple', 'data-bs-toggle="modal" data-bs-target="#libraryModal"', 'loadLibrary()')
                typeHtml = Html.ckeditor(array[index]['row'], array[index]['value'], array[index]['class'], array[index]['id'], array[index]['placeholder']) + Html.p('mt-3', uploadFile)
            }
            else if (array[index]['type'] == 'checkbox') {
                typeHtml = '<div class="form-control">'+array[index]['array']+'</div>';
            }
            str += Html.div('col-md-' + array[index]['col'] + ((array[index]['type'] == 'hidden') ? ' d-none' : ''),
                Html.div('form-group fill', Html.label(array[index]['title'], 'form-label') + typeHtml + Html.span('error error_' + array[index]['id'])))
        }
        if (id != undefined) { str += Html.input('hidden', '', 'idEdit', id) }
        return str;
    }

    arrCheckbox(array=[], nameID='', oldArray=[]){
        let str='<ul class="newAtributes" id="id'+nameID+'">';
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            nameID=nameID.toLowerCase()
            let checked = '';
            if(oldArray.length > 0){
                const found = oldArray.find((e) => e.toString() == element._id.toString());
                if(found) checked = 'checked';
            }
            str+='<li>';
                str+='<input type="checkbox" name="'+nameID+'" id="'+nameID+'_'+element._id+'" value="'+element._id+'" '+checked+'>';
                str+=' <label for="'+nameID+'_'+element._id+'">'+element.title+'</label>';
            str+='</li>';
        }
        str+='</ul>';
        return str;
    }

    async form() {
        const id = this.req.params['id']
        return await this.index(await this.formHTML(id));
    }

    getValue(field) {
        return this.req.body[field]
    }

    async arrange() {
        await this.model.update(
            { _id: new mongoose.Types.ObjectId(this.getValue('id')) },
            { sort: parseInt(this.getValue('sort')) }
        );
        this.res.send('ok')
    }

    async sortNumber() {
        const data = await this.model.getDetail(
            this.sort != undefined ? { [this.sort]: this.getValue(this.sort) } : {},
            this.sort != undefined ? { 'sort': -1 } : { 'created': -1 }
        )
        return data.length > 0 ? parseInt(data[0]['sort']) + 1 : 1;
    }

    convertStrArrToObjArr(array){
        const newArray = [];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            newArray.push(new mongoose.Types.ObjectId(element))
        }
        return newArray;
    }

    async process() {
        const id = this.req.query['id']
        let error = [];
        error = await this.checkForm(id)

        if (error.length == 0) {
            if (this.getValue['password'] != undefined) { this.req.body['password'] = bcrypt.hashSync(this.getValue['password'], salt); }
            if (this.req.body['parentID'] == '') { delete this.req.body['parentID']; }
            if (this.req.body['color'] != undefined){ 
                this.req.body['color'] = this.convertStrArrToObjArr(JSON.parse(this.req.body['color']))
            }
            if (this.req.body['pin'] != undefined){ 
                this.req.body['pin'] = this.convertStrArrToObjArr(JSON.parse(this.req.body['pin']))
            }
            if (id == 'undefined') {
                this.req.body['sort'] = await this.sortNumber();
                this.req.body['userID'] = this.req.cookies.user[0]['_id'];
                await this.model.create(this.req.body)
            } else {
                this.req.body['updated'] = new Date()
                await this.model.update(this.objectId(id), this.req.body);
            }
        }
        return this.res.send(error)
    }

    checkFormatEmail() {
        return Validation.checkEmail(this.getValue('email'))
    }

    checkFormatPhone() {
        return Validation.checkPhone(this.getValue('phone'))
    }

    checkPasswordLength(number) {
        return Validation.checkMaxLength(this.getValue('password'), number)
    }

    checkPasswordCompare() {
        return Validation.checkCompare(this.getValue('password'), this.getValue('re_password'))
    }

    async checkExistData(field, id) {
        const obj = { [field]: this.getValue(field) }
        if (id != 'undefined') { obj['_id'] = { $ne: new mongoose.Types.ObjectId(id) } }
        const data = await this.model.getDetail(obj)
        return data.length == 0 ? true : false;
    }

    objectId(id) {
        return { _id: new mongoose.Types.ObjectId(id) }
    }

    objectField(field) {
        return { [field]: this.getValue(field) }
    }

    async delete() {
        const data = await this.model.getDetail(this.objectId(this.req.body.id))
        await this.model.delete(this.objectId(this.req.body.id))
        if (data[0]['avatar'] != '') {
            const path = 'public/uploads/' + this.params(2) + '/' + data[0]['avatar'];
            if (fs.existsSync(path)) { fs.unlinkSync(path); }
        }
        return this.res.send({ code: 200 })
    }

    async status() {
        await this.model.update(this.objectId(this.req.body.id), { [this.req.body.key]: this.req.body.status, updated: new Date() })
        return this.res.send({ code: 200 })
    }

    async dataCommon(key = '', sort = {}, select='title') {
        const limit = this.getNumber(this.req.query.limit, this.params(2) != 'category'?process.env.LIMIT: 100);
        const page = this.getNumber(this.req.query.page, 0);
        const skip = (page == 1 || page == 0) ? 0 : (page - 1) * limit;
        return await this.model.getList(this.search(key), select, parseInt(limit), skip, sort)
    }

    async dataFull(key = '') {
        return await this.model.getFull(this.search(key), '_id')
    }

    theadCommon() {
        const array = this.theadList()
        let th = ''; for (let index = 0; index < array.length; index++) { th += Html.th(array[index]['title'], array[index]['class'], array[index]['width']) }
        return Html.thead(Html.tr(th))
    }

    search(key = '') {
        let searchObject = {}
        if (this.req.query.search) {
            searchObject[key] = { '$regex': this.req.query.search, '$options': 'i' }
        }
        if (this.req.query.parentID) {
            searchObject['parentID'] = new mongoose.Types.ObjectId(this.req.query.parentID)
        }
        return searchObject;
    }

    getNumber(value, _default) {
        return value ? !isNaN(value) ? parseInt(value) : _default : _default
    }

    convertDate(value) {
        const date = moment(value);
        return date.format('DD') + '/' + date.format('MM') + '/' + date.format('YYYY') + '<br/>' + date.format('HH') + ':' + date.format('m') + ':' + date.format('s')
    }

    tdSort(array, _class, _id, _value, _event) {
        return Html.td(Html.select(array, _class, _id, _value, _event), 'align-middle text-center')
    }

    tdUser(value) {
        return Html.td(Html.span('badge bg-info', value), 'align-middle text-center')
    }

    tdType(value) {
        return Html.td(Html.span('badge bg-success', value), 'align-middle text-center')
    }

    tdImage(image, id) {
        return Html.td(Html.image('image wid-50', image, 'modal', id), 'text-center')
    }

    tdDate(date) {
        return Html.td(this.convertDate(date), 'text-center align-middle')
    }

    tdFloat(id, float) {
        return Html.td(Html.float(id, (float == true ? 'checked' : '')), 'text-center')
    }

    tdStatus(id, status) {
        return Html.td(Html.status(id, (status == true ? 'checked' : '')), 'text-center')
    }

    tdEdit(id, module) {
        return this.params(2)!='order'&& this.params(2)!='customer'? Html.a(Html.icon('edit'), '/admin/' + module + '/edit/' + id, 'btn btn-sm btn-outline-info has-ripple') : ''
    }

    tdDelete(id, value) {
        return Html.button(Html.icon('trash'), 'btn btn-sm btn-outline-danger has-ripple', ' data-bs-toggle="modal" data-bs-target="#deleteModal"', "popupDelete('" + id + "', '" + value + "')")
    }

    tdFunction(id, module, value) {
        return Html.td(this.tdEdit(id, module) + '&nbsp;' + this.tdDelete(id, value), 'text-center align-middle')
    }

    async upload() {
        const id = this.req.body.id;
        const avatar = this.res.locals.file['value']
        const data = await this.model.getDetail(this.objectId(id))
        await this.model.update(this.objectId(id), { avatar });
        if (data[0]['avatar'] != '') {
            const newFile = 'public' + this.res.locals.file['path'] + data[0]['avatar']
            if (fs.existsSync(newFile)) { fs.unlinkSync(newFile) }
        }
        this.res.send({ kq: 1, path: this.res.locals.file['path'] + avatar })
    }

    async load() {
        const Library_Models = require('../models/Library_Models')
        this.res.send({ data: await Library_Models.getFull() })
    }

    async loadLibrary() {
        const avatar = this.res.locals.file['value']
        const Library_Models = require('../models/Library_Models')
        await this.model.create({ avatar, userID: this.req.cookies.user[0]['_id'] })
        this.res.send({ data: await Library_Models.getFull() })
    }

    async login() {
        const User_Models = require('../models/User_Models')
        const checkEmail = await User_Models.getDetail({ email: this.getValue('email'), status: true })
        if (checkEmail.length == 0 || (checkEmail.length > 0 && !bcrypt.compareSync(this.getValue('password'), checkEmail[0]['password']))) {
            return this.res.send({ kq: false });
        }
        const data = await User_Models.getFull(this.objectField('email'), 'email avatar')
        this.res.cookie('user', data, { maxAge: 1000 * 60 * 60 * 6 });
        return this.res.send({ kq: true })
    }
}
module.exports = Controllers