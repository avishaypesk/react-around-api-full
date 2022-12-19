import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import CurrentUserContext from '../contexts/CurrentUserContext';

const UserDetails = (props) => {
  const { handleLogout } = props;
  const [isOpen, setIsOpen] = React.useState(null);
  const currentUser = React.useContext(CurrentUserContext);

  useEffect(() => {
    setIsOpen(true);
    return () => setIsOpen(false);
  }, []);
  return (
    <div className={`user-details ${isOpen && 'user-details_open'}`}>
      <span className="header__email">{currentUser.email}</span>
      <div className="header__link" onClick={handleLogout}>
        <Link to={'/signin'} style={{ color: 'inherit', textDecoration: 'inherit' }}>
          {'Log out'}
        </Link>
      </div>
    </div>
  );
};

export default UserDetails;