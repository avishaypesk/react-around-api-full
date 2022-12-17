import PopupWithForm from "./PopupWithForm";
import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

export default function EditProfilePopup({ isOpen, onClose, onUpdateUser, buttonText }) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  const handleNameChange = (event) => setName(event.target.value);

  const handleTitleChange = (event) => setDescription(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateUser({ name, about: description });
  };

  return (
    <PopupWithForm
      name="profile"
      title="Edit profile"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={buttonText}
      onSubmit={handleSubmit}
    >
      <input
        onChange={handleNameChange}
        value={name || ""}
        type="text"
        placeholder="Name"
        id="name-input"
        className="form__input form__input_type_name"
        name="profileName"
        minLength="2"
        maxLength="40"
        required
      />
      <span id="name-input-error" className="form__input-error"></span>
      <input
        onChange={handleTitleChange}
        value={description || ""}
        type="text"
        placeholder="Title"
        id="title-input"
        className="form__input form__input_type_title"
        name="profileTitle"
        minLength="2"
        maxLength="200"
        required
      />
      <span id="title-input-error" className="form__input-error"></span>
    </PopupWithForm>
  );
}
