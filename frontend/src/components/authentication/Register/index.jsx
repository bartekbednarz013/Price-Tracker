import './style.css';
import { Link, Navigate } from 'react-router-dom';
import { Fragment, useState } from 'react';

const Register = () => {
  const initialValues = {
    username: '',
    email: '',
    password: '',
    password2: '',
  };

  const [state, setState] = useState(initialValues);

  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

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

  const onSubmit = (e) => {
    e.preventDefault();
    // this.props.login(state.username, state.password);
  };

  return (
    <Fragment>
      <div className="register-wrapper">
        <div className="auth-header">Create account</div>
        <form className="register-form" onSubmit={onSubmit}>
          <div className="form-field">
            <label htmlFor="username">Login</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={onChange}
              className="login-form-input"
              value={state.username}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={onChange}
              className="login-form-input"
              value={state.email}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={onChange}
              className="login-form-input"
              value={state.password}
              required
              minLength="6"
            />
          </div>

          <div className="form-field field-before-show-password">
            <label htmlFor="password2">Confirm password</label>
            <input
              type="password"
              id="password2"
              name="password2"
              onChange={onChange}
              className="login-form-input"
              value={state.password2}
              required
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
              value="Sign up"
              className="login-register-submit"
            />
          </div>
        </form>
      </div>
      <div className="login-register-redirect">
        Have an account? <Link to="/auth/login">Sign in!</Link>
      </div>
    </Fragment>
  );
};

export default Register;
