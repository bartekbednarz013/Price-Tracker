import './style.css';

const ShowPassword = ({ onChange }) => {
  return (
    <div className="show-password">
      <input
        type="checkbox"
        id="showPassword"
        name="showPassword"
        onChange={onChange}
        placeholder="Show password"
      />
      <label htmlFor="showPassword">Show password</label>
    </div>
  );
};

export default ShowPassword;
