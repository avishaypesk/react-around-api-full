const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middleware/auth');

const validateURL = (value, helpers) => (validator.isURL(value) ? value : helpers.error('string.uri'));

const createCardSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().custom(validateURL).required(),
  }),
});

const cardIdSchema = celebrate({
  params: Joi.object().keys({ cardId: Joi.hex().min(24).max(24).required() }),
});

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  removeLike,
} = require('../controllers/cards');

router.get('/cards', auth, getCards);
router.post('/cards', auth, createCardSchema, createCard);
router.delete('/cards/:cardId', auth, cardIdSchema, deleteCard);
router.put('/cards/:cardId/likes', auth, cardIdSchema, likeCard);
router.delete('/cards/:cardId/likes', auth, cardIdSchema, removeLike);

module.exports = router;
