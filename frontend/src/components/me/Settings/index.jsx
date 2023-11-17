import './style.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as Logout } from '../../../svg/logout.svg';
import { userLoggedOut } from '../../../features/auth/authSlice';
import {
  useLazyDeleteAccountQuery,
  useLazyChangePasswordQuery,
  useLazyChangeMailingStatusQuery,
} from '../../../features/api/apiSlice';
import { apiSlice } from '../../../features/api/apiSlice';
import { notificationShowed } from '../../../features/notifications/notificationsSlice';
import InputField from '../../common/form-fields/InputField';
import SubmitField from '../../common/form-fields/SubmitField';
import ShowPassword from '../../common/form-fields/ShowPassword';
import CheckboxToggle from '../../common/CheckboxToggle';

const Settings = () => {
  const { username, email, email_notifications } = useSelector(
    (state) => state.auth.user
  );

  const initialValues = {
    password: '',
    password2: '',
    emailNotification: email_notifications,
  };

  const [state, setState] = useState(initialValues);

  const dispatch = useDispatch();

  const [deleteAccountQuery] = useLazyDeleteAccountQuery();
  const [changePasswordQuery] = useLazyChangePasswordQuery();
  const [changeMailingStatusQuery] = useLazyChangeMailingStatusQuery();

  const openPasswordChanger = () => {
    document.querySelector('.show-change-password-button').style.display =
      'none';
    document.querySelector('.change-password-form').style.display = 'block';
    document.getElementById('password').focus();
  };

  const closePasswordChanger = () => {
    document.querySelector('.show-change-password-button').style.display =
      'initial';
    document.querySelector('.change-password-form').style.display = 'none';
  };

  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const changeMailingStatus = async () => {
    const { isError } = await changeMailingStatusQuery(
      !state.emailNotification
    );
    if (!isError)
      setState({ ...state, emailNotification: !state.emailNotification });
  };

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

  const changePassword = async (e) => {
    e.preventDefault();
    if (state.password === state.password2) {
      const { isError } = await changePasswordQuery(state.password);
      if (!isError) setState({ ...state, password: '', password2: '' });
      closePasswordChanger();
    } else {
      dispatch(
        notificationShowed({
          type: 'error',
          detail: 'Both password must be matched!',
        })
      );
    }
  };

  const openAccountDeleter = () => {
    document.querySelector('.show-delete-account-button').style.display =
      'none';
    document.querySelector('.delete-account-form').style.display = 'block';
  };

  const deleteAccount = async (e) => {
    e.preventDefault();
    await deleteAccountQuery();
    dispatch(apiSlice.util.resetApiState());
  };

  const logout = () => {
    dispatch(userLoggedOut());
    dispatch(apiSlice.util.resetApiState());
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
          <p>{username}</p>
        </div>
        <div className="user-info-field">
          <h3>Email</h3>
          <p>{email}</p>
        </div>

        <div className="user-settings-field">
          <h3>Email notifications</h3>
          <CheckboxToggle
            id="email-notification-checkbox"
            name="emailNotification"
            checked={state.emailNotification}
            onChange={changeMailingStatus}
          />
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
            <InputField
              type="password"
              id="password"
              name="password"
              onChange={onChange}
              value={state.password}
              placeholder="Enter new password"
              minLength="6"
              required={true}
            />
            <InputField
              type="password"
              id="password2"
              name="password2"
              onChange={onChange}
              value={state.password2}
              placeholder="Confirm new password"
              minLength="6"
              required={true}
            />
            <ShowPassword onChange={showPassword} />
            <SubmitField value="Set new password" />
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
                required
              />
              <label htmlFor="delete-account-checkbox">
                I want to delete my account.
              </label>
            </div>
            <SubmitField value="Delete account" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
