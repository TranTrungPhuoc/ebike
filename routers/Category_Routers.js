const express = require('express')
const router = express.Router()

const Controllers = require('../controllers/Category_Controllers')
router.get('/index', (req, res) => new Controllers(req, res).index())
router.get('/add', (req, res) => new Controllers(req, res).form())
router.get('/edit/:id', (req, res) => new Controllers(req, res).form())
router.post('/process', (req, res) => new Controllers(req, res).process())
router.post('/delete', (req, res) => new Controllers(req, res).delete())
router.post('/status', (req, res) => new Controllers(req, res).status())

const Api = require('../api/Category_Api')
router.get('/getItemsNews', (req, res) => new Api(req, res).getItemsNews())
router.get('/getItemsHome', (req, res) => new Api(req, res).getItemsHome())
router.get('/getItemsRelative/:slug', (req, res) => new Api(req, res).getItemsRelative())
router.get('/getItemsDetail/:slug', (req, res) => new Api(req, res).getItemsDetail())
router.get('/getViewMore/:slug', (req, res) => new Api(req, res).getViewMore())
router.get('/getItemsHomeDetail/:slug', (req, res) => new Api(req, res).getItemsHomeDetail())

module.exports=router