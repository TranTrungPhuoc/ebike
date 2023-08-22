const express = require('express')
const router = express.Router()
const Controllers = require('../helpers/Controllers')
router.get('/', (req, res) => res.render('partials/login'))
router.post('/login/proccess', (req, res) => new Controllers(req, res).login())
module.exports=router