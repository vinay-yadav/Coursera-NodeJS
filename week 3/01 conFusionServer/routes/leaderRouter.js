const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const Leader = require('../models/Leader');

router.use(bodyParser.json());

// URL : /
router.get('/', (req, res) => {
    Leader.find()
        .sort("-updatedAt")
        .then(leaders => res.json(leaders))
        .catch(err => res.json('error in getting leaders: ' + err));
});


router.post('/', (req, res) => {
    Leader.create(req.body)
            .then(leader => {
                if(!leader)
                    return res.status(501).json('error in saving a leader');
                res.json(leader);
            })
            .catch(err => res.json('error in saving leader: ' + err));
})

router.put('/', (req, res) => {
    res.status(403).json('PUT operation not supported on /leaders');
})

router.delete('/', (req, res) => {
    Leader.remove()
        .then(resp => res.json(resp))
        .catch(err => res.json('error in deleting leaders: ' + err));
})

// URL: /:leadId
router.get('/:leadId', (req, res) => {
    Leader.findById(req.params.leadId)
        .then(leader => {
            if(!leader)
                return res.status(400).json('No leader exists');
            res.json(leader);
        })
        .catch(err => res.json('error in getting leader: ' + err));
});


router.post('/:leadId', (req, res) => {
    res.status(403).json('POST operation not supported on /leader/'+ req.params.leadId);
})

router.put('/:leadId', (req, res) => {
    Leader.findByIdAndUpdate(
        req.params.leadId,
        {$set: req.body},
        {new: true}
    )
    .then(leader => {
        if(!leader)
            return res.json('invalid leader id');
        res.json(leader);
    })
    .catch(err => res.json("error in updating leader: " + err));
})

router.delete('/:leadId', (req, res) => {
    Leader.findByIdAndRemove(req.params.leadId)
        .then(resp => res.json(resp))
        .catch(err => res.json("error in deleting leader: " + err));
})

module.exports = router;
