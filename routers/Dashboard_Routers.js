const express = require('express')
const router = express.Router()
const Controllers = require('../controllers/Dashboard_Controllers')
router.get('/index', (req, res) => new Controllers(req, res).index())
module.exports=router