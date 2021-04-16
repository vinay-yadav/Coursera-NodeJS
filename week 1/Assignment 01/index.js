const express = require('express')
const morgan = require('morgan');
const app = express();

const hostname = "localhost";
const port = 3000;

// server logs
app.use(morgan('dev'));

// routes
const dish = require('./routes/dishRouter');
const promotion = require('./routes/promotionRouter');
const leader = require('./routes/leaderRouter');

app.use('/dishes', dish);
app.use('/promotions', promotion);
app.use('/leaders', leader);

app.listen(port, hostname, () => console.log(`Server is running @ http://${hostname}:${port}`));
