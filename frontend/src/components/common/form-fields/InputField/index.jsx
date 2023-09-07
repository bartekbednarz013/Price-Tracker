import '../style.css';

const InputField = ({
  label,
  type,
  inputName,
  value,
  checked,
  placeholder,
  onChange,
  required,
  disabled,
}) => (
  <div className="form-field">
    {label && <label htmlFor={label}>{label}</label>}
    <input
      type={type}
      name={inputName}
      value={value}
      checked={checked}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      disabled={disabled}
    />
  </div>
);

export default InputField;
