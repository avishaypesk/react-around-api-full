const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const ValidationError = require('../utils/validationerror');
const NotFoundError = require('../utils/notfounderror');
const AuthorizationError = require('../utils/authorizationerror');
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER,
  UNAUTHORIZED,
} = require('../utils/errorcodes');

const { JWT_SECRET, NODE_ENV } = process.env;

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new AuthorizationError('Incorrect email or password.');
    })
    .then((user) => bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        throw new AuthorizationError('Incorrect email or password.');
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    }))
    .catch((err) => {
      if (err instanceof AuthorizationError) {
        res.status(UNAUTHORIZED).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw new NotFoundError('User list is empty.');
    })
    .then((users) => res.send(users))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => {
      throw new NotFoundError('User not found.');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError('Invalid user id received.');
        res.status(BAD_REQUEST).send({ message: error.message });
      } else if (err instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const getCurrentUser = (req, res) => {
  res.send(req.user);
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!password) throw new ValidationError('Missing password field.');
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(201).send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          const error = new ValidationError('Invalid user data received.');
          res.status(BAD_REQUEST).send({ message: error.message });
        } else {
          res
            .status(INTERNAL_SERVER)
            .send({ message: 'An error has occurred on the server' });
        }
      });
  });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const { _id: id } = req.user;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError('User id not found.');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError('Invalid user id received.');
        res.status(BAD_REQUEST).send({ message: error.message });
      } else if (err instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id: id } = req.user;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('User id not found.');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError('Invalid user id received.');
        res.status(BAD_REQUEST).send({ message: error.message });
      } else if (err instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  getCurrentUser,
  updateUserAvatar,
  updateUser,
  login,
};
