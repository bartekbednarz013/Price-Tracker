import './style.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logout } from '../../../svg/logout.svg';

const Settings = () => {
  const initialValues = {
    username: 'Bartek',
    email: 'bartek123@gmail.com',
    password: '',
    password2: '',
  };

  const [state, setState] = useState(initialValues);

  const openPasswordChanger = () => {
    document.querySelector('.show-change-password-button').style.display =
      'none';
    document.querySelector('.change-password-form').style.display = 'block';
    document.getElementById('password').focus();
  };

  const onChange = (e) => setState({ [e.target.name]: e.target.value });

  const showPassword = () => {
    const showPasswordCheckbox = document.getElementById('showPassword');
    if (showPasswordCheckbox.checked) {
      document.getElementById('password').type = 'text';
      document.getElementById('password2').type = 'text';
    } else {
      document.getElementById('password').type = 'password';
      document.getElementById('password2').type = 'password';
    }
  };

  const changePassword = (e) => {
    e.preventDefault();
  };

  const openAccountDeleter = () => {
    document.querySelector('.show-delete-account-button').style.display =
      'none';
    document.querySelector('.delete-account-form').style.display = 'block';
  };

  const deleteAccount = (e) => {
    e.preventDefault();
    // this.props.deleteAccount();
  };

  const logout = () => {
    console.log('Logout');
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-header">
        <span className="user-settings-title">Your account details</span>
        <Link to="/" className="logout-link" onClick={logout}>
          <span>Logout</span>
          <Logout />
        </Link>
      </div>
      <div className="user-settings">
        <div className="user-info-field">
          <h3>Username</h3>
          <p>{state.username}</p>
        </div>
        <div className="user-info-field">
          <h3>Email</h3>
          <p>{state.email}</p>
        </div>

        <div className="user-settings-field">
          <h3>Password</h3>
          <p
            onClick={openPasswordChanger}
            className="show-change-password-button"
          >
            Change password
          </p>
          <form onSubmit={changePassword} className="change-password-form">
            <div className="form-field">
              <input
                type="password"
                id="password"
                name="password"
                onChange={onChange}
                className="login-form-input"
                value={state.password}
                required
                placeholder="Enter new password"
                minLength="6"
              />
            </div>
            <div className="form-field">
              <input
                type="password"
                id="password2"
                name="password2"
                onChange={onChange}
                className="login-form-input"
                value={state.password2}
                required
                placeholder="Confirm new password"
                minLength="6"
              />
            </div>
            <div className="show-password">
              <input
                type="checkbox"
                id="showPassword"
                name="showPassword"
                onChange={showPassword}
                className="login-form-input"
                placeholder="Show password"
              />
              <label htmlFor="showPassword">Show password</label>
            </div>
            <div className="form-field submit-field">
              <input
                type="submit"
                value="Set new password"
                className="login-register-submit"
              />
            </div>
          </form>
        </div>
        <div className="user-settings-field last-user-settings-field">
          <h3>Account</h3>
          <p
            onClick={openAccountDeleter}
            className="show-delete-account-button"
          >
            Delete account
          </p>
          <form onSubmit={deleteAccount} className="delete-account-form">
            <div className="delete-account-input">
              <input
                type="checkbox"
                id="delete-account-checkbox"
                name="delete-account-checkbox"
                className="login-form-input"
                required
              />
              <label htmlFor="delete-account-checkbox">
                I want to delete my account.
              </label>
            </div>
            <div className="form-field submit-field">
              <input
                type="submit"
                value="Delete account"
                className="login-register-submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
