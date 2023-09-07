import './style.css';

const SubmitField = ({ value }) => (
  <div className="form-field submit-field">
    <input type="submit" value={value} />
  </div>
);

export default SubmitField;
