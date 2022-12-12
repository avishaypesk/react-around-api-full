const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb');

const helmet = require('helmet');

app.use(helmet());

const { NOT_FOUND } = require('./utils/errorcodes');

const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '632daf867955a330642600c2',
  };

  next();
});

app.use('/', userRouter);
app.use('/', cardRouter);

app.use('/', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Requested resource not found.' });
});

const allowedCors = [
  'https://practicum.tk',
  'http://practicum.tk',
  'localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
