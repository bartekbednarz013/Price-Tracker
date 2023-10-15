import './style.css';

const HiddenInput = ({
  id,
  type,
  name,
  value,
  onChange,
  required,
  disabled,
}) => (
  <div id={id} className="hidden-input hidden">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
    />
  </div>
);

export default HiddenInput;
