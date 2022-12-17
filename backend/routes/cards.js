const router = require('express').Router();

const auth = require('../middleware/auth');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  removeLike,
} = require('../controllers/cards');

router.get('/cards', auth, getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', auth, deleteCard);
router.put('/cards/:cardId/likes', auth, likeCard);
router.delete('/cards/:cardId/likes', auth, removeLike);

module.exports = router;
