import './style.css';

const SubmitField = ({ value, id, disabled }) => (
  <div className="form-field submit-field">
    <input type="submit" id={id} value={value} disabled={disabled} />
  </div>
);

export default SubmitField;
