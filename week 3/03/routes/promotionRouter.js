const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const Promotion = require("../models/Promotion");

router.use(bodyParser.json());

// Url: /
router.get('/', (req, res) => {
    Promotion.find()
            .sort("-updatedAt")
            .then(promotions => res.json(promotions))
            .catch(err => res.json("error in getting promtions: " + err));
});


router.post('/', (req, res) => {
    Promotion.create(req.body)
            .then(promotion => {
                if(promotion)
                    return res.json(promotion);
                
                res.json('error in saving promotion');
            })
            .catch(err => res.json("error in saving promtion: " + err));
})

router.put('/', (req, res) => {
    res.status(403).json('PUT operation not supported on /promotions');
})

router.delete('/', (req, res) => {
    Promotion.remove()
            .then(resp => res.json(resp))
            .catch(err => res.json("error in deleting promtions: " + err));

})

// URL: /:promoId
router.get('/:promoId', (req, res) => {
    Promotion.findById(req.params.promoId)
            .then(promotion => {
                if(!promotion)
                    return res.json('invalid promotion id');
                res.json(promotion);
            })
            .catch(err => res.json("error in getting promtion: " + err));
});


router.post('/:promoId', (req, res) => {
    res.status(403).json('POST operation not supported on /promotions/'+ req.params.promoId);
})

router.put('/:promoId', (req, res) => {
    Promotion.findByIdAndUpdate(
        req.params.promoId,
        {$set: req.body},
        {new: true}
    )
    .then(promotion => {
        if(!promotion)
            return res.json('invalid promotion id');
        res.json(promotion);
    })
    .catch(err => res.json("error in updating promtion: " + err));
})

router.delete('/:promoId', (req, res) => {
    Promotion.findByIdAndRemove(req.params.promoId)
        .then(resp => res.json(resp))
        .catch(err => res.json("error in deleting promtion: " + err));
})

module.exports = router;
