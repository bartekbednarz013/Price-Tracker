import { useState } from 'react';

const SetPassword = () => {
  initialValues = {
    password: '',
    password2: '',
  };

  const [state, setState] = useState(initialValues);

  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="set-password-wrapper">
      <div className="auth-header">Set new password</div>
      <form className="set-password-form" onSubmit={onSubmit}>
        <InputField
          label="Password"
          type="password"
          name="password"
          onChange={onChange}
          value={state.password}
          required={true}
        />
        <InputField
          label="Confirm password"
          type="password"
          name="password2"
          onChange={onChange}
          value={state.password2}
          required={true}
        />
        <SubmitField value="Set new password" />
      </form>
    </div>
  );
};

export default SetPassword;
