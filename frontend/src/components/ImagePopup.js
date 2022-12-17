export default function ImagePopup(props) {
  return (
    <div className={` popup preview ${props.card ? "popup_visible" : ""}`}>
      <div className="preview__window">
        <button type="button" className="popup__close-button" onClick={props.onClose}></button>
        <img src={props.card?.link} alt="Preview Image" className="preview__preview-image" />
        <p className="preview__description">{props.card?.name}</p>
      </div>
    </div>
  );
}
