import { Link } from "react-router-dom";
import logo from "../images/Vector.svg";
import HeaderNav from './HeaderNav';

export default function Header(props) {
  return (
    <header className="header">
      <Link to="/">
      <img src={logo} alt="Around the U.S." className="header__title" />
      </Link>
      <HeaderNav {...props} />
    </header>
  );
}
