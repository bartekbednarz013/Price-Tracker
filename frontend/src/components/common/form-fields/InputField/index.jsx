import '../style.css';

const InputField = ({
  label,
  type,
  name,
  value,
  checked,
  placeholder,
  onChange,
  required,
  disabled,
  additionalClassName,
  minValue,
  maxValue,
  minLength,
  maxLength,
}) => (
  <div className={'form-field ' + (additionalClassName ?? '')}>
    {label && <label htmlFor={name}>{label}</label>}
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      checked={checked}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      disabled={disabled}
      min={minValue}
      max={maxValue}
      minLength={minLength}
      maxLength={maxLength}
    />
  </div>
);

export default InputField;
