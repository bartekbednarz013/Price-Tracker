import InputField from '../../common/form-fields/InputField';
import SubmitField from '../../common/form-fields/SubmitField';
import { useState } from 'react';
import { useLazyResetPasswordQuery } from '../../../features/api/apiSlice';

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const [resetPasswordQuery] = useLazyResetPasswordQuery();

  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    const { isError } = await resetPasswordQuery(email);
    if (!isError) {
      setEmail('');
    }
  };

  return (
    <div className="reset-password-wrapper">
      <div className="auth-header">Forgot your password?</div>
      <form className="reset-password-form" onSubmit={onSubmit}>
        <InputField
          type="email"
          name="email"
          onChange={onChange}
          value={email}
          required={true}
          placeholder="Enter your email"
        />
        <SubmitField value="Reset password" />
      </form>
    </div>
  );
};

export default ResetPassword;
