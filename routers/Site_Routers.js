const express = require('express')
const router = express.Router()

const Controllers = require('../controllers/Site_Controllers')
router.get('/edit/:id', (req, res) => {new Controllers(req, res).form()})
router.post('/process', (req, res) => new Controllers(req, res).process())

const Api = require('../api/Site_Api')
router.get('/getList', (req, res) => new Api(req, res).getList())

module.exports=router