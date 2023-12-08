const express = require('express')
const router = express.Router()

const Controllers = require('../controllers/Course_Controllers')
router.get('/index', (req, res) => new Controllers(req, res).index())
router.get('/add', (req, res) => new Controllers(req, res).form())
router.get('/edit/:id', (req, res) => new Controllers(req, res).form())
router.post('/process', (req, res) => new Controllers(req, res).process())
router.post('/delete', (req, res) => new Controllers(req, res).delete())
router.post('/status', (req, res) => new Controllers(req, res).status())

const Api = require('../api/Course_Api')
router.get('/getList', (req, res) => new Api(req, res).getListApi())
router.post('/postRegister', (req, res) => new Api(req, res).postRegisterApi())

module.exports=router