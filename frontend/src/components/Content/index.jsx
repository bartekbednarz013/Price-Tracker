import './style.css';
import { Routes, Route } from 'react-router-dom';
import Auth from '../authentication/Auth';
import Register from '../authentication/Register';
import Login from '../authentication/Login';
import ResetPassword from '../authentication/ResetPassword';
import SetPassword from '../authentication/SetPassword';
import Account from '../me/Account';
import Scraper from '../Scraper';

const Content = () => {
  return (
    <div className="content">
      <Routes>
        <Route path="/" element={<Scraper />} />
        <Route path="auth" element={<Auth />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="me" element={<Account />} />
      </Routes>
    </div>
  );
};

export default Content;
