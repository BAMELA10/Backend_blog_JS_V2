const express = require('express')
const multer = require('multer');
const {uploadPicture} = require('../controller/uploadController')
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'uploads/img/'))
    },
    filename: (req, file, cb) => {
        const prefix = Date.now() + "_" + Math.round(Math.random()* Math.random()*11).toString()
        cb(null, prefix + '_' + file.fieldname + path.extname(file.originalname));
    }
})

const upload = multer({storage:storage});
const router = express.Router();

router
.route('/image')
.post(upload.single('upload'), uploadPicture);

module.exports = router;