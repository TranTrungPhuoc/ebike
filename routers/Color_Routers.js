const express = require('express')
const router = express.Router()

const Controllers = require('../controllers/Color_Controllers')
router.get('/index', (req, res) => new Controllers(req, res).index())
router.get('/add', (req, res) => new Controllers(req, res).form())
router.get('/edit/:id', (req, res) => new Controllers(req, res).form())
router.post('/process', (req, res) => new Controllers(req, res).process())
router.post('/delete', (req, res) => new Controllers(req, res).delete())
router.post('/status', (req, res) => new Controllers(req, res).status())

const Api = require('../api/Color_Api')
router.get('/getRelative/:slug', (req, res) => new Api(req, res).getRelative())
router.get('/viewMore', (req, res) => new Api(req, res).viewMore())
router.get('/feature', (req, res) => new Api(req, res).feature())
router.get('/getDetailSlug/:slug', (req, res) => new Api(req, res).getDetailSlug())
router.get('/view/:id', (req, res) => new Api(req, res).view())
router.get('/search', (req, res) => new Api(req, res).search())
router.get('/new', (req, res) => new Api(req, res).new())
router.get('/getList', (req, res) => new Api(req, res).getList())

module.exports=router