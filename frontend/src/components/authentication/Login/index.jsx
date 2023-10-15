import './style.css';
import InputField from '../../common/form-fields/InputField';
import SubmitField from '../../common/form-fields/SubmitField';
import { Link, Navigate } from 'react-router-dom';
import { Fragment, useState } from 'react';
import { useLazyLoginQuery } from '../../../features/api/apiSlice';
import { useSelector } from 'react-redux';

const Login = () => {
  const initialValues = {
    username: '',
    password: '',
  };

  const [state, setState] = useState(initialValues);

  const [loginQuery] = useLazyLoginQuery();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/me" />;
  }

  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    await loginQuery(state);
  };

  return (
    <Fragment>
      <div className="login-wrapper">
        <div className="auth-header">Login</div>
        <form className="login-form" onSubmit={onSubmit}>
          <InputField
            label="Username"
            type="text"
            name="username"
            onChange={onChange}
            value={state.username}
            required={true}
          />
          <div className="form-field">
            <div className="password-grid">
              <label htmlFor="password">Password</label>
              <div className="reset-password">
                <Link to="/auth/reset-password" className="reset-password-link">
                  Forgot password?
                </Link>
              </div>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              onChange={onChange}
              value={state.password}
              required
            />
          </div>
          <SubmitField value="Login" />
        </form>
      </div>
      <div className="login-register-redirect">
        Don't have an account? <Link to="/auth/register">Sign up!</Link>
      </div>
    </Fragment>
  );
};

export default Login;
