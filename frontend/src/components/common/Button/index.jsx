import './style.css';

const Button = ({ value, onClick, disabled}) => (
  <button className="button" onClick={onClick} disabled={disabled}>
    {value}
  </button>
);

export default Button;
