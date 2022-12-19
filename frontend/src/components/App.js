import React, { useEffect } from "react";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import Main from './Main';
import api from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import ProtectedRoute from './ProtectedRoute';
import Footer from './Footer';
import Header from './Header';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoToolTip';
import { register, authenticate } from '../utils/auth';
import UserDetails from "./UserDetails";
import Register from './Register';
import Login from './Login';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const [isAuthOkPopupOpen, setIsAuthOkPopupOpen] = React.useState(false);
  const [isAuthErrPopupOpen, setIsAuthErrPopupOpen] = React.useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = React.useState(false);
  const [isMobileSized, setIsMobileSized] = React.useState(window.innerWidth <= 650);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [addPlacebuttonText, setAddPlaceButtonText] = React.useState('Create');
  const [editProfileButtonText, setEditProfileButtonText] = React.useState('Save');
  const [editAvatarButtonText, setEditAvatarButtonText] = React.useState('Save');
  const [signupButtonText, setSignupButtonText] = React.useState('Sign up');
  const [loginButtonText, setLoginButtonText] = React.useState('Sign in');
  const [cards, setCards] = React.useState([]);
  const history = useHistory();

  const handleResize = () => setWindowWidth(window.innerWidth);

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

  const handlePopupClick = (event) => event.target.classList.contains('popup_active') && closeAllPopups();

  const handleUpdateUser = ({ name, about }) => {
    setEditProfileButtonText('Updating...');
    api
      .updateUserInfo({ name, about })
      .then((user) => {
        setCurrentUser({ ...currentUser, ...user });
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setEditProfileButtonText('Save'));
  };

  const handleUpdateAvatar = (url) => {
    setEditAvatarButtonText('Updating...');
    api
      .updateUserImage(url)
      .then((user) => {
        setCurrentUser({ ...currentUser, ...user });
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setEditAvatarButtonText('Save'));
  };

  const handleAddPlaceSubmit = ({ name, link }) => {
    setAddPlaceButtonText('Saving...');
    api
      .submitNewCard({ name, link })
      .then((card) => {
        setCards([card, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setAddPlaceButtonText('Create'));
  };

  const handleCardLike = (card, isLiked) => {
    api
      .handleLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((currentCard) => (currentCard._id === card._id ? newCard : currentCard)));
      })
      .catch((err) => console.log(err));
  };

  const handleNewUserSubmit = ({ email, password }) => {
    setSignupButtonText('Signing you up!');
    register({ email, password })
      .then((user) => {
        setIsAuthOkPopupOpen(true);
        history.push("/signin");
      })
      .catch((err) => {
        setIsAuthErrPopupOpen(true);
      })
      .finally(() => {
        setSignupButtonText('Sign up');
      });
  };

  const handleLogin = ({ email, password }) => {
    setLoginButtonText('Logging you in!');
    authenticate({ email, password })
      .then((user) => {
        // receives user.token
        localStorage.setItem('jwt', user.token);
        setIsLoggedIn(true);
        setCurrentUser({ ...currentUser, email });
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
        setIsAuthErrPopupOpen(true);
      })
      .finally(() => {
        setLoginButtonText('Log in');
      });
  };

  const handleLogout = () => {
    setCurrentUser({});
    setIsLoggedIn(false);
    setIsUserDetailsOpen(false);
    setCards([]);
    localStorage.removeItem('jwt');
  };

  const handleHamburgerClick = () => {
    setIsUserDetailsOpen(!isUserDetailsOpen);
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsAuthOkPopupOpen(false);
    setIsAuthErrPopupOpen(false);
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

  const handleCardDeleteClick = ({ _id: id }) => {
    api
      .deleteCard(id)
      .then(() => {
        const filteredCards = cards.filter((card) => card._id !== id);
        setCards(filteredCards);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const getUserInfoFromAPI = () => {
      return api.init();
    };
    const getUserInfoFromToken = () => {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setIsLoggedIn(false);
        history.push('/signin');
      }
    };

    if (isLoggedIn && cards.length === 0) {
      Promise.allSettled([getUserInfoFromAPI(), getUserInfoFromToken()])
        .then((values) => {
          const [cards, userFromAPI] = values[0].value; // handle API info
          const userFromToken = values[1].value ? values[1].value.data : null; // handle localstorage data
          setCards(cards);
          setCurrentUser({ ...userFromToken, ...userFromAPI });
          if (userFromToken) {
            setIsLoggedIn(true);
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    }

    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', closeByEscape);
    return () => {
      document.removeEventListener('keydown', closeByEscape);
      window.removeEventListener('resize', handleResize);
    };
  },[]);

  useEffect(() => {
    setIsMobileSized(windowWidth <= 650);
  }, [windowWidth]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">

        {isUserDetailsOpen && isMobileSized && <UserDetails handleLogout={handleLogout} />}
        <Header
          isMobileSized={isMobileSized}
          isDropDownOpen={isUserDetailsOpen}
          handleHamburgerClick={handleHamburgerClick}
          handleLogout={handleLogout}
          isLoggedIn={isLoggedIn}
        />

        <Switch>
          <ProtectedRoute exact path="/" isLoggedIn={isLoggedIn}>
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
              onPopupClick={handlePopupClick}
              buttonText={editProfileButtonText}
              onUpdateUser={handleUpdateUser}
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
            />

            <EditAvatarPopup
              onPopupClick={handlePopupClick}
              buttonText={editAvatarButtonText}
              onUpdateAvatar={handleUpdateAvatar}
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
            />

            <AddPlacePopup
              onPopupClick={handlePopupClick}
              buttonText={addPlacebuttonText}
              onAddPlaceSubmit={handleAddPlaceSubmit}
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
            />
          </ProtectedRoute>

          <Route path="/signin" isLoggedIn={isLoggedIn}>
            <Login onSubmit={handleLogin} buttonText={loginButtonText} />
          </Route>

          <Route path="/signup" isLoggedIn={isLoggedIn}>
            <Register onSubmit={handleNewUserSubmit} buttonText={signupButtonText} />
          </Route>

          <Route>
            {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>

        </Switch>

        <InfoTooltip
          title="Success! You have now been registered."
          isOpen={isAuthOkPopupOpen}
          onClose={closeAllPopups}
          isSuccessful={true}
          onPopupClick={handlePopupClick}
        />
        <InfoTooltip
          title="Oops, something went wrong! Please try again."
          isOpen={isAuthErrPopupOpen}
          onClose={closeAllPopups}
          isSuccessful={false}
          onPopupClick={handlePopupClick}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider >
  );
}

export default App;

