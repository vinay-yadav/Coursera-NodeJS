const express = require('express');
const cors = require('cors');

const app = express();

const whiteList = [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;

  if (whiteList.indexOf(req.header.origin) !== -1)
      corsOptions = {origin: true};
  else
      corsOptions = {origin: false};

  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
