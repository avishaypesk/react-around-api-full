import successImage from '../images/authsucess.svg';
import errorImage from '../images/autherror.svg';

export default function InfoTooltip(props) {
  const { onPopupClick, title, isOpen, onClose, isSuccessful } = props;
  return (
    <div onClick={onPopupClick} className={`popup popup_type_info ${isOpen ? 'popup_visible' : ''}`}>
      <div className="info__window">
        <button type="button" className="popup__close-button" onClick={onClose}></button>
        <img
          className="info__auth-image"
          alt={isSuccessful ? 'success' : 'error'}
          src={isSuccessful ? successImage : errorImage}
        ></img>
        <h2 className="info__text">{title}</h2>
      </div>
    </div>
  );
}