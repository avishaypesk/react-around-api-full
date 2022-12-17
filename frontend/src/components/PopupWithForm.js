export default function PopupWithForm({isOpen, onClose, name, title, buttonText, children, onSubmit}) {
  return (
    <div className={`popup form form_type_${name} ${isOpen ? "popup_visible" : " "}`}>
      <div className={`form__container form__container_type_${name}`}>
        <button
          type="button"
          className="button popup__close-button"
          onClick={onClose}
        ></button>
        <form onSubmit={onSubmit} className={`form form__${name} popup__form`} name={name}>
          <h3 className="form__title">{title}</h3>
          {children}
          <button type="submit" className="button form__save-button">{buttonText}</button>
        </form>
      </div>
    </div>
  );
}
