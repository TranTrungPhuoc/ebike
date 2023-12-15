const express = require('express')
const router = express.Router()
const prefix = process.env.ROUTER_PREFIX
router.use('/', require('../routers/Login_' + prefix))
router.get('/admin/*', (req, res, next) => {
    (req.cookies.user==undefined) ? res.redirect('/') : next()
})
const array = [
    'Dashboard', 
    'User', 
    'Category', 
    'Product',
    'Color',
    'Pin',
    'Post', 
    'Menu', 
    'Share',
    'Course',
    'Network',
    'Contact',
    'Site',
    'Mail',
    'Home',
    'Library'
];
for (let index = 0; index < array.length; index++) {
    const element = array[index];
    router.use( '/admin/'+element.toLowerCase(), require('../routers/'+element+'_' + prefix))
    router.use( '/api/'+element.toLowerCase(), require('../routers/'+element+'_' + prefix))
}
router.get('/*', (req, res) => res.render('error'))
module.exports=router