const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const router = express.Router();
const Promotion = require("../models/Promotion");

router.use(bodyParser.json());

// Url: /
router.get('/', (req, res, next) => {
    Promotion.find()
        .sort("-updatedAt")
        .then(promotions => res.json(promotions))
        .catch(err => next(err));
});


router.post('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.create(req.body)
        .then(promotion => {
            if (promotion)
                return res.json(promotion);

            res.json('error in saving promotion');
        })
        .catch(err => next(err));
})

router.put('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    let err = new Error('PUT operation not supported on /promotions');
    err.status = 400;
    next(err);
})

router.delete('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.remove()
        .then(resp => res.json(resp))
        .catch(err => next(err));

})

// URL: /:promoId
router.get('/:promoId', (req, res, next) => {
    Promotion.findById(req.params.promoId)
        .then(promotion => {
            if (!promotion) {
                let err = new Error('Invalid Promotion ID');
                err.status = 400;
                return next(err);
            }
            res.json(promotion);
        })
        .catch(err => next(err));
});


router.post('/:promoId', authenticate.verifyUser, (req, res, next) => {
    let err = new Error('POST operation not supported on /promotions/' + req.params.promoId);
    err.status = 400;
    next(err);
})

router.put('/:promoId', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndUpdate(
        req.params.promoId,
        {$set: req.body},
        {new: true}
    )
        .then(promotion => {
            if (!promotion) {
                let err = new Error('Invalid Promotion ID');
                err.status = 400;
                return next(err);
            }
            res.json(promotion);
        })
        .catch(err => next(err));
})

router.delete('/:promoId', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndRemove(req.params.promoId)
        .then(resp => res.json(resp))
        .catch(err => next(err));
})

module.exports = router;
