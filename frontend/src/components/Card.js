import CurrentUserContext from "../contexts/CurrentUserContext";
import React from "react";

export default function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = currentUser._id === props.card.owner._id;
  const isLiked = props.card.likes.some(({ _id }) => _id === currentUser._id);
  const cardLikeButtonClassName = isLiked
    ? `button places__like-button places__like-button_active`
    : `button places__like-button`;

  const handleClick = () => props.onCardClick(props.card);

  const handleLikeClick = () => props.onCardLike(props.card, isLiked);

  const handleDeleteClick = () => props.onCardDelete(props.card);

  return (
    <article className="places__card">
      {isOwn && <button type="button" className="button places__remove-button" onClick={handleDeleteClick}></button>}
      <img
        src={props.card.link}
        alt={props.card.name}
        className="places__image"
        onClick={handleClick}
      />
      <div className="places__bottom">
        <h2 className="places__title">{props.card.name}</h2>
        <div className="places__like-section">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          ></button>
          <span className="places__like-count">{props.card.likes.length}</span>
        </div>
      </div>
    </article>
  );
}
