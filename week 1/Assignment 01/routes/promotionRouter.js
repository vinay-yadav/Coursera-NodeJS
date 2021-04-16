const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());

// URL : /
router.all('/', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text');
    next();
});

router.get('/', (req, res) => {
    res.end('Will send all the promotions to you!');
});


router.post('/', (req, res) => {
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})

router.put('/', (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})

router.delete('/', (req, res) => {
    res.end('Deleting all promotions');
})

// URL: /:promoId
router.all('/:promoId', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text');
    next();
});

router.get('/:promoId', (req, res) => {
    res.end('Will send the details of the promotion: ' + req.params.promoId + ' to you.');
});


router.post('/:promoId', (req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})

router.put('/:promoId', (req, res) => {
    res.write('Updating the promotion: ' + req.params.promoId + '\n');
    res.end('Will update the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})

router.delete('/:promoId', (req, res) => {
    res.end('Deleting promotion: ' + req.params.promoId);
})

module.exports = router;
