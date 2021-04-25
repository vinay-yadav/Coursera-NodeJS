const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('We dont allow this file extension'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter
});

const router = express.Router();

router.use(bodyParser.json());


router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    let err = new Error('Request method not supported');
    err.status = 400;
    next(err);
})

router.post('/', authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.json(req.file);
})

module.exports = router;
