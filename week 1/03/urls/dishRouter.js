const express = require('express');
const bodyparser = require('body-parser');

const router = express.Router();

// router.get('/', (req, res) => {
//     console.log(req.headers);
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text');
//     res.end('Hello there!!! GET');
// })

router.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text');
    next();
})
.get((req, res) => {
    res.end('On GET');
})
.put((req, res) => {
    res.end('On PUT');
})
.post((req, res) => {
    res.end('On POST');
});

module.exports = router;