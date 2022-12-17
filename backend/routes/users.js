const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');

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
router.get('/users/:id', auth, getUser);
router.post('/signup', createUserSchema, createUser);
router.post('/signin', loginSchema, login);
router.patch('/users/me', auth, updateUser);
router.patch('/users/me/avatar', auth, updateUserAvatar);

module.exports = router;
