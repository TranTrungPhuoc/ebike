const express = require('express')
const router = express.Router()
const Controllers = require('../controllers/User_Controllers')
router.get('/index', (req, res) => new Controllers(req, res).index())
router.get('/add', (req, res) => new Controllers(req, res).form())
router.get('/edit/:id', (req, res) => new Controllers(req, res).form())
router.post('/process', (req, res) => new Controllers(req, res).process())
router.post('/delete', (req, res) => new Controllers(req, res).delete())
router.post('/status', (req, res) => new Controllers(req, res).status())
router.get('/logout', (req, res) => new Controllers(req, res).logout())
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/user')
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
            res.locals.file = {path: '/uploads/user/', value: req.file['filename']};
            next()
        }
    })
},
(req, res) => new Controllers(req, res).upload())
module.exports=router