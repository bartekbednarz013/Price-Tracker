import './style.css';

const HiddenInput = ({
  id,
  type,
  inputName,
  value,
  onChange,
  required,
  disabled,
}) => (
  <div id={id} className="hidden-input hidden">
    <input
      type={type}
      name={inputName}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
    />
  </div>
);

export default HiddenInput;
