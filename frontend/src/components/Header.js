import logo from "../images/Vector.svg";

export default function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Around the U.S." className="header__title" />
    </header>
  );
}
