const Card = require('../models/cards');
const ValidationError = require('../utils/validationerror');
const NotFoundError = require('../utils/notfounderror');
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER,
} = require('../utils/errorcodes');
const AuthorizationError = require('../utils/authorizationerror');

const getCards = (req, res) => {
  Card.find({})
    .orFail(() => {
      throw new NotFoundError('Card not found.');
    })
    .then((cards) => res.send(cards))
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

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Invalid card data received.');
        res.status(BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(INTERNAL_SERVER)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (!card) throw new NotFoundError('Card not found.');
      if (card.owner.toString() !== req.user._id) throw new AuthorizationError('Unauthorized card deletion request', 403);
      return Card.findByIdAndRemove(req.params.cardId).then((deletedCard) => {
        res.send(deletedCard);
      });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Card id not found.');
    })
    .then((card) => res.send(card))
    .catch(next);
};

const removeLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Card id not found.');
    })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  removeLike,
};
