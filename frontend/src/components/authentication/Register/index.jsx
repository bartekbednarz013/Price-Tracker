import InputField from '../../common/form-fields/InputField';
import SubmitField from '../../common/form-fields/SubmitField';
import { Link, useNavigate } from 'react-router-dom';
import { Fragment, useState } from 'react';
import {
  useLazyRegisterQuery,
  // useLazyLoginQuery,
} from '../../../features/api/apiSlice';
import { useSelector, useDispatch } from 'react-redux';
import ShowPassword from '../../common/form-fields/ShowPassword';
import { notificationShowed } from '../../../features/notifications/notificationsSlice';

const Register = () => {
  const initialValues = {
    username: '',
    email: '',
    password: '',
    password2: '',
  };

  const [state, setState] = useState(initialValues);

  const [registerQuery] = useLazyRegisterQuery();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (isAuthenticated) {
    navigate('/me');
  }

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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (state.password === state.password2) {
      const { isError } = await registerQuery(state);
      if (!isError) {
        navigate('/auth/login');
      }
    } else {
      dispatch(
        notificationShowed({
          type: 'error',
          detail: 'Both password must be matched!',
        })
      );
    }
  };

  return (
    <Fragment>
      <div className="register-wrapper">
        <div className="auth-header">Create account</div>
        <form className="register-form" onSubmit={onSubmit}>
          <InputField
            label="Username"
            type="text"
            name="username"
            onChange={onChange}
            value={state.username}
            required={true}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            onChange={onChange}
            value={state.email}
            required={true}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            onChange={onChange}
            value={state.password}
            required={true}
            minLength="6"
          />
          <InputField
            label="Confirm password"
            type="password"
            name="password2"
            onChange={onChange}
            value={state.password2}
            required={true}
            minLength="6"
            additionalClassName="field-before-show-password"
          />
          <ShowPassword onChange={showPassword} />
          <SubmitField value="Sign up" />
        </form>
      </div>
      <div className="login-register-redirect">
        Have an account? <Link to="/auth/login">Sign in!</Link>
      </div>
    </Fragment>
  );
};

export default Register;
