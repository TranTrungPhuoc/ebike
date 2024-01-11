const express = require('express')
const router = express.Router()

const Schema = require('../schemas/Product_Schema')
const axios = require('axios');
const fs = require('fs');

// const downloadImage = async (imageUrl, outputPath) => {
//     try {
//         const response = await axios({
//             method: 'GET',
//             url: imageUrl,
//             responseType: 'stream',
//         });
//         response.data.pipe(fs.createWriteStream(outputPath));
//         return new Promise((resolve, reject) => {
//             response.data.on('end', () => resolve());
//             response.data.on('error', (error) => reject(error));
//         });
//     } catch (error) {
//         console.error('Error downloading image:', error.message);
//     }
// };
// const data = await Schema.find({avatar: {$ne: ''}}).select('avatar').exec();
// const path = 'public/upload/product/';
// for (let index = 0; index < data.length; index++) {
//     const element = data[index];
//     const outputPath = element.avatar;
//     const myArray = outputPath.split('/');
//     const lastElement = myArray[myArray.length - 1];
//     if(outputPath.includes("https://homesheel.com.vn/")){
//         await downloadImage(outputPath, lastElement).then(() => 'ok');
//     }
// }

const Controllers = require('../controllers/Product_Controllers')
router.get('/index', async (req, res) =>{
    // const data = await Schema.find({avatar: {$ne: ''}}).select('avatar').exec();
    // for (let index = 0; index < data.length; index++) {
    //     const element = data[index];
    //     const myArray = element.avatar.split('/');
    //     const lastElement = myArray[myArray.length - 1];
    //     // console.log(lastElement);
    //     await Schema.updateMany({_id: element._id}, {avatar: lastElement});
    // }
    // return
    new Controllers(req, res).index()
} )
router.get('/add', (req, res) => new Controllers(req, res).form())
router.get('/edit/:id', (req, res) => new Controllers(req, res).form())
router.post('/process', (req, res) => new Controllers(req, res).process())
router.post('/delete', (req, res) => new Controllers(req, res).delete())
router.post('/status', (req, res) => new Controllers(req, res).status())
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/product')
    },
    filename: function (req, file, cb) {
        if ((file.mimetype != 'image/png') && (file.mimetype != 'image/jpeg')) {
            cb('SV: File không đúng định dạng');
        }
        else {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const name_file = file.originalname.split('.');
            const lastItem = name_file[name_file.length - 1];
            var result;
            var firstItem = '';
            if (name_file.length > 2) {
                name_file.pop();
                name_file.forEach(e => { firstItem += e + '-'; });
                result = firstItem.substring(0, firstItem.length - 1);
            } else {
                result = name_file[0];
            }
            cb(null, result + '-' + uniqueSuffix + '.' + lastItem);
        }
    }
});
const limits = { fileSize: 10240000 };
const upload = multer({ storage, limits }).single('file');
router.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.send({ kq: 0, err })
        } else if (err) {
            res.send({ kq: 0, err })
        } else {
            res.locals.file = { path: '/uploads/product/', value: req.file['filename'] };
            next()
        }
    })
},
    (req, res) => new Controllers(req, res).upload())

const Api = require('../api/Product_Api')
const { schema } = require('../schemas/User_Schema')
router.get('/getRelative/:slug', (req, res) => new Api(req, res).getRelative())
router.get('/viewMore', (req, res) => new Api(req, res).viewMore())
router.get('/feature', (req, res) => new Api(req, res).feature())
router.get('/view/:id', (req, res) => new Api(req, res).view())
router.get('/search', (req, res) => new Api(req, res).search())

router.get('/home', (req, res) => new Api(req, res).home())
router.get('/detail', (req, res) => new Api(req, res).detail())

module.exports = router