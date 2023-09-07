import './style.css';

const Button = ({ value, onClick }) => (
  <button className="button" onClick={onClick}>
    {value}
  </button>
);

export default Button;
