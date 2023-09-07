import './style.css';
import { ReactComponent as Account } from '../../svg/account.svg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-link"></div>
      <Link to="/">
        <div className="app-name">Price Tracker</div>
      </Link>
      <Link to="/me" className=" navbar-link account-link">
        <Account />
      </Link>
    </div>
  );
};

export default Navbar;
