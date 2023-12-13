const express = require('express')
const router = express.Router()

const Controllers = require('../controllers/Category_Controllers')
router.get('/index', (req, res) => new Controllers(req, res).index())
router.get('/add', (req, res) => new Controllers(req, res).form())
router.get('/edit/:id', (req, res) => new Controllers(req, res).form())
router.post('/process', (req, res) => new Controllers(req, res).process())
router.post('/delete', (req, res) => new Controllers(req, res).delete())
router.post('/status', (req, res) => new Controllers(req, res).status())
router.post('/listType', (req, res) => new Controllers(req, res).listType())

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/category')
    },
    filename: function (req, file, cb) {
        if((file.mimetype != 'image/png') && (file.mimetype != 'image/jpeg')){
            cb('SV: File không đúng định dạng');
        }
        else{
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const name_file = file.originalname.split('.');
            const lastItem = name_file[name_file.length - 1];
            var result;
            var firstItem = '';
            if(name_file.length > 2){
                name_file.pop();
                name_file.forEach(e => { firstItem+= e + '-'; });
                result = firstItem.substring(0, firstItem.length - 1);
            }else{
                result = name_file[0];
            }
            cb(null, result + '-' + uniqueSuffix + '.' + lastItem);
        }
    }
});
const limits = {fileSize: 10240000};
const upload = multer({ storage, limits }).single('file');
router.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.send({kq:0, err})
        } else if (err) {
            res.send({kq:0, err})
        }else{
            res.locals.file = {path: '/uploads/product/', value: req.file['filename']};
            next()
        }
    })
},
(req, res) => new Controllers(req, res).upload())

const Api = require('../api/Category_Api')
router.get('/getItemsNews', (req, res) => new Api(req, res).getItemsNews())
router.get('/getItemsHome', (req, res) => new Api(req, res).getItemsHome())
router.get('/getItemsRelative/:slug', (req, res) => new Api(req, res).getItemsRelative())
router.get('/getItemsDetail/:slug', (req, res) => new Api(req, res).getItemsDetail())
router.get('/getViewMore/:slug', (req, res) => new Api(req, res).getViewMore())
router.get('/getItemsHomeDetail/:slug', (req, res) => new Api(req, res).getItemsHomeDetail())

router.get('/menuCategory', (req, res) => new Api(req, res).menuCategory())
router.get('/home', (req, res) => new Api(req, res).categoryHome())

module.exports=router