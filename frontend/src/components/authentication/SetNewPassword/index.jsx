import { useState } from 'react';
import InputField from '../../common/form-fields/InputField';
import SubmitField from '../../common/form-fields/SubmitField';
import ShowPassword from '../../common/form-fields/ShowPassword';
import { useLazySetNewPasswordQuery } from '../../../features/api/apiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { notificationShowed } from '../../../features/notifications/notificationsSlice';

const SetNewPassword = () => {
  const initialValues = {
    password: '',
    password2: '',
  };

  const [state, setState] = useState(initialValues);

  const [setNewPasswordQuery] = useLazySetNewPasswordQuery();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { token } = useParams();

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
      const { isError } = await setNewPasswordQuery({
        token: token,
        password: state.password,
      });
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
    <div className="set-new-password-wrapper">
      <div className="auth-header">Set new password</div>
      <form className="set-password-form" onSubmit={onSubmit}>
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
        <SubmitField value="Set new password" />
      </form>
    </div>
  );
};

export default SetNewPassword;
