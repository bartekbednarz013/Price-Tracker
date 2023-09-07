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
  <div className="hidden-input hidden">
    <input
      type={type}
      id={id}
      name={inputName}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default HiddenInput;
