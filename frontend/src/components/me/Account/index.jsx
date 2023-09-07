import './style.css';
import { useState } from 'react';

import MyItemsTable from '../my-items/MyItemsTable';
import Settings from '../Settings';

const Account = () => {
  const [settingsTab, setSettingsTab] = useState(false);

  const changeTab = () => setSettingsTab(!settingsTab);

  return (
    <div>
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
        {!settingsTab && <MyItemsTable />}
        {settingsTab && <Settings />}
      </div>
    </div>
  );
};

export default Account;
