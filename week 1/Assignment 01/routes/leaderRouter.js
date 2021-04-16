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
    res.end('Will send all the leaders to you!');
});


router.post('/', (req, res) => {
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})

router.put('/', (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})

router.delete('/', (req, res) => {
    res.end('Deleting all leaders');
})

// URL: /:leadId
router.all('/:leadId', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text');
    next();
});

router.get('/:leadId', (req, res) => {
    res.end('Will send the details of the leader: ' + req.params.leadId + ' to you.');
});


router.post('/:leadId', (req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leader/'+ req.params.leadId);
})

router.put('/:leadId', (req, res) => {
    res.write('Updating the leader: ' + req.params.leadId + '\n');
    res.end('Will update the leader: ' + req.body.name + ' with details: ' + req.body.description);
})

router.delete('/:leadId', (req, res) => {
    res.end('Deleting leader: ' + req.params.leadId);
})

module.exports = router;
