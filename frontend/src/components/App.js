import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import React, { useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCardClick = (card) => setSelectedCard(card);

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  const handleAddNewCardClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleUpdateUser = ({ name, about }) => {
    setIsLoading(true);

    api
      .updateUserInfo({ name, about })
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateAvatar = (url) => {
    setIsLoading(true);

    api
      .updateUserImage(url)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const handleAddPlaceSubmit = ({ name, link }) => {
    setIsLoading(true);

    api
      .submitNewCard({ name, link })
      .then((card) => {
        setCards([card, ...cards]);
        closeAllPopups();
        setIsLoading(false);
      })

      .catch((err) => console.log(err));
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
  };

  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };

    document.addEventListener("keydown", closeByEscape);

    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  useEffect(() => {
    api
      .getUserInfo()
      .then((user) => setCurrentUser(user))
      .catch((err) => console.log(err));
  }, []);

  const [cards, setCards] = React.useState([]);

  const handleCardLike = (card, isLiked) => {
    api
      .handleLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) => (currentCard._id === card._id ? newCard : currentCard))
        );
      })
      .catch((err) => console.log(err));
  };

  const handleCardDeleteClick = ({ _id: id }) => {
    api
      .deleteCard(id)
      .then(() => {
        const filteredCards = cards.filter((card) => card._id !== id);
        setCards(filteredCards);
      })
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    api
      .getInitialCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Main
          onEditProfileClick={handleEditProfileClick}
          onAddPlaceClick={handleAddNewCardClick}
          onEditAvatarClick={handleEditAvatarClick}
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDeleteClick}
        />
        <Footer />
        <EditProfilePopup
          onUpdateUser={handleUpdateUser}
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          buttonText={isLoading ? "Saving..." : "Save"}
        />

        <EditAvatarPopup
          onUpdateAvatar={handleUpdateAvatar}
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          buttonText={isLoading ? "Saving..." : "Save"}
        />

        <AddPlacePopup
          onAddPlaceSubmit={handleAddPlaceSubmit}
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          buttonText={isLoading ? "Creating..." : "Create"}
        />

        <PopupWithForm
          name="delete-confirm"
          title="Are you sure?"
          onClose={closeAllPopups}
        ></PopupWithForm>

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

