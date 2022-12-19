import React, { useContext } from "react";
import pencil from "../images/edit-avatar.svg";
import Card from "./Card";
import CurrentUserContext from "../contexts/CurrentUserContext";

export default function Main(props) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div className="profile__avatar" style={currentUser.avatar ? { backgroundImage: `url(${currentUser.avatar})` } : null}>
          <div className="profile__avatar-overlay">
            <img
              src={pencil}
              alt="edit avatar"
              className="profile__avatar-icon"
              onClick={props.onEditAvatarClick}
            />
          </div>
        </div>
        <div className="profile__profile-info">
          <div className="profile__name-wrapper">
            <h1 className="profile__name">{currentUser.name || "Jacques Cousteau"}</h1>
            <button
              type="button"
              className="button profile__edit-button"
              onClick={props.onEditProfileClick}
            ></button>
          </div>
          <p className="profile__title">{currentUser.about || 'Explorer'}</p>
        </div>
        <button
          type="button"
          className="button profile__add-button"
          onClick={props.onAddPlaceClick}
        ></button>
      </section>

      <section className="places">
        {props.cards.map((card) => {
          return (
            <Card
              key={card._id}
              card={card}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          );
        })}
      </section>
    </main>
  );
}
