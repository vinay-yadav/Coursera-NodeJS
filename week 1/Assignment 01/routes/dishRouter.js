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
    res.end('Will send all the dishes to you!');
});


router.post('/', (req, res) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})

router.put('/', (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})

router.delete('/', (req, res) => {
    res.end('Deleting all dishes');
})

// URL: /:dishId
router.all('/:dishId', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text');
    next();
});

router.get('/:dishId', (req, res) => {
    res.end('Will send the details of the dish: ' + req.params.dishId + ' to you.');
});


router.post('/:dishId', (req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})

router.put('/:dishId', (req, res) => {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
})

router.delete('/:dishId', (req, res) => {
    res.end('Deleting dish: ' + req.params.dishId);
})

module.exports = router;
