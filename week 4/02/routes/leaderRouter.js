const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const router = express.Router();
const Leader = require('../models/Leader');

router.use(bodyParser.json());

// URL : /
router.get('/', (req, res, next) => {
    Leader.find()
        .sort("-updatedAt")
        .then(leaders => res.json(leaders))
        .catch(err => next(err));
});


router.post('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leader.create(req.body)
        .then(leader => {
            if (!leader) {
                let err = new Error('Error in saving leader')
                return next(err);
            }
            res.json(leader);
        })
        .catch(err => next(err));
})

router.put('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    let err = new Error('PUT operation not supported on /leaders');
    err.status = 400;
    return next(err);
})

router.delete('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leader.remove()
        .then(resp => res.json(resp))
        .catch(err => next(err));
})

// URL: /:leadId
router.get('/:leadId', (req, res, next) => {
    Leader.findById(req.params.leadId)
        .then(leader => {
            if (!leader) {
                let err = new Error('Leader does not exists');
                err.status = 404;
                return next(err);
            }
            res.json(leader);
        })
        .catch(err => res.json('error in getting leader: ' + err));
});


router.post('/:leadId', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    let err = new Error('POST operation not supported on /leader/' + req.params.leadId);
    err.status = 400;
    next(err);
})

router.put('/:leadId', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leader.findByIdAndUpdate(
        req.params.leadId,
        {$set: req.body},
        {new: true}
    )
        .then(leader => {
            if (!leader) {
                let err = new Error('Invalid leader id');
                err.status = 404;
                return next(err);
            }
            res.json(leader);
        })
        .catch(err => next(err));
})

router.delete('/:leadId', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leader.findByIdAndRemove(req.params.leadId)
        .then(resp => res.json(resp))
        .catch(err => next(err));
})

module.exports = router;
