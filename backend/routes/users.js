const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middleware/auth');

const validateURL = (value, helpers) => (validator.isURL(value) ? value : helpers.error('string.uri'));

const createUserSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }),
});

const loginSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const getUserSchema = celebrate({
  params: Joi.object().keys({
    id: Joi.string().min(24).max(24).required(),
  }),
});

const updateUserSchema = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    })
    .min(1),
});

const updateAvatarSchema = celebrate({
  body: Joi.object().keys({ avatar: Joi.string().custom(validateURL) }),
});

const {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
} = require('../controllers/users');

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getCurrentUser);
router.get('/users/:id', auth, getUserSchema, getUser);
router.post('/signup', createUserSchema, createUser);
router.post('/signin', loginSchema, login);
router.patch('/users/me', auth, updateUserSchema, updateUser);
router.patch('/users/me/avatar', auth, updateAvatarSchema, updateUserAvatar);

module.exports = router;
