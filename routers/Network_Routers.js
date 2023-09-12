const express = require('express')
const router = express.Router()

const Controllers = require('../controllers/Network_Controllers')
router.get('/index', (req, res) => new Controllers(req, res).index())
router.get('/add', (req, res) => new Controllers(req, res).form())
router.get('/edit/:id', (req, res) => new Controllers(req, res).form())
router.post('/process', (req, res) => new Controllers(req, res).process())
router.post('/delete', (req, res) => new Controllers(req, res).delete())
router.post('/status', (req, res) => new Controllers(req, res).status())
router.post('/sort', (req, res) => new Controllers(req, res).arrange())

const Api = require('../api/Network_Api')
router.get('/getSocialNetwork', (req, res) => new Api(req, res).getSocialNetwork())

module.exports=router