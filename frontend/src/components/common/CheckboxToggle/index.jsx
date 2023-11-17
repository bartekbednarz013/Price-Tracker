import './style.css';

const CheckboxToggle = ({ id, name, checked, onChange }) => (
  <label className="checkbox-toggle">
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      onChange={onChange}
    />
    <span className="slider round"></span>
  </label>
);

export default CheckboxToggle;
