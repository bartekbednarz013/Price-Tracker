import './style.css';
import { Routes, Route } from 'react-router-dom';
import Auth from '../authentication/Auth';
import Register from '../authentication/Register';
import Login from '../authentication/Login';
import ResetPassword from '../authentication/ResetPassword';
import SetNewPassword from '../authentication/SetNewPassword';
import ActivateAccount from '../authentication/ActivateAccount';
import Account from '../me/Account';
import Scraper from '../Scraper';

const Content = () => {
  return (
    <div id="content" className="content">
      <Routes>
        <Route path="/" element={<Scraper />} />
        <Route path="auth" element={<Auth />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="set-new-password/:token" element={<SetNewPassword />} />
          <Route
            path="activate-account/:status"
            element={<ActivateAccount />}
          />
        </Route>
        <Route path="me" element={<Account />} />
        <Route path="*" element={<Scraper />} />
      </Routes>
    </div>
  );
};

export default Content;
