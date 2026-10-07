import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../../CartContext';
import './SiteHeader.css';

// Header for the inner pages (profile, cart): same brand and links as the home hero
function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="site-header">
      <Link to="/home" className="site-logo">
        <img src="/img/brand/mark-lemon.svg" alt="" />
        Two Tone
      </Link>
      <nav>
        <NavLink to="/home" end>Home</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/cart" className="site-cart">Cart <span>{count}</span></NavLink>
      </nav>
    </header>
  );
}

export default SiteHeader;
