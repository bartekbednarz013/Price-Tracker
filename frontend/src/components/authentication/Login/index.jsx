import './style.css';
import { Link, Navigate } from 'react-router-dom';
import { Fragment, useState } from 'react';

const Login = () => {
  const initialValues = {
    username: '',
    password: '',
  };

  const [state, setState] = useState(initialValues);

  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
  };

  // if (this.props.isAuthenticated) {
  //   return <Navigate to="/account" />;
  // }

  return (
    <Fragment>
      <div className="login-wrapper">
        <div className="auth-header">Login</div>
        <form className="login-form" onSubmit={onSubmit}>
          <div className="form-field">
            <label htmlFor="username">Username</label>
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
            <div className="password-grid">
              <label htmlFor="password">Password</label>
              <div className="reset-password">
                <Link to="../reset-password" className="reset-password-link">
                  Forgot password?
                </Link>
              </div>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              className="login-form-input"
              onChange={onChange}
              value={state.password}
              required
            />
          </div>
          <div className="form-field submit-field">
            <input
              type="submit"
              value="Login"
              className="login-register-submit"
            />
          </div>
        </form>
      </div>
      <div className="login-register-redirect">
        Don't have an account? <Link to="/auth/register">Sign up!</Link>
      </div>
    </Fragment>
  );
};

export default Login;
