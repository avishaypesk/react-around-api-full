const express = require('express');
const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb');

const helmet = require('helmet');

app.use(helmet());

const { errors } = require('celebrate');

const { NOT_FOUND } = require('./utils/errorcodes');

const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');

const centralerrhandler = require('./middleware/centralerrhandler');

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

app.use(errors());
app.use(centralerrhandler);

app.use('/', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Requested resource not found.' });
});

app.listen(PORT);
