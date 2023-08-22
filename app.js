const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000

const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI).then(() => {}).catch(() => console.log('Failed!'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/', require('./helpers/Router'))

app.listen(port, () => console.log(`App listening on port ${port}!`))