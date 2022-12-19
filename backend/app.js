const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

const { errorLogger, requestLogger } = require('./middleware/logger');

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(errorLogger);

app.use('/', userRouter);
app.use('/', cardRouter);

app.use(errors());
app.use(centralerrhandler);

app.use('/', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Requested resource not found.' });
});

app.listen(PORT);
