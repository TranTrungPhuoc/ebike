const express = require('express')
const router = express.Router()

const Controllers = require('../controllers/Store_Controllers')
router.get('/index', (req, res) => new Controllers(req, res).index())
router.get('/add', (req, res) => new Controllers(req, res).form())
router.get('/edit/:id', (req, res) => new Controllers(req, res).form())
router.post('/process', (req, res) => new Controllers(req, res).process())
router.post('/delete', (req, res) => new Controllers(req, res).delete())
router.post('/status', (req, res) => new Controllers(req, res).status())
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/store')
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
            res.locals.file = {path: '/uploads/store/', value: req.file['filename']};
            next()
        }
    })
},
(req, res) => new Controllers(req, res).upload())

const Api = require('../api/Store_Api')
router.get('/getRelative/:slug', (req, res) => new Api(req, res).getRelative())
router.get('/viewMore', (req, res) => new Api(req, res).viewMore())
router.get('/feature', (req, res) => new Api(req, res).feature())
router.get('/getDetailSlug/:slug', (req, res) => new Api(req, res).getDetailSlug())
router.get('/view/:id', (req, res) => new Api(req, res).view())
router.get('/search', (req, res) => new Api(req, res).search())
router.get('/new', (req, res) => new Api(req, res).new())
router.get('/getList', (req, res) => new Api(req, res).getList())
router.post('/insert', (req, res) => new Api(req, res).insert())

module.exports=router