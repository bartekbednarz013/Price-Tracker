import './style.css';
import { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Settings from '../Settings';
import MyItems from '../my-items/MyItems';

const Account = () => {
  const [settingsTab, setSettingsTab] = useState(false);

  const changeTab = () => setSettingsTab(!settingsTab);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <Fragment>
      <div className="tab-toggle">
        <label className="toggle">
          <input
            type="checkbox"
            id="tab-toggle-checkbox"
            checked={settingsTab}
            onChange={changeTab}
          />

          <span className="slider"></span>
          <span className="toggle-option first-option">My Items</span>
          <span className="toggle-option second-option">Settings</span>
        </label>
      </div>
      <div className="tab-container">
        {!settingsTab && <MyItems />}
        {settingsTab && <Settings />}
      </div>
    </Fragment>
  );
};

export default Account;
