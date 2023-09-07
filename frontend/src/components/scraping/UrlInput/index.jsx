import './style.css';
import { useState } from 'react';
import InputField from '../../common/form-fields/InputField';
import SubmitField from '../../common/form-fields/SubmitField';

const UrlInput = () => {
  const [url, setUrl] = useState('');

  const onChange = (e) => setUrl(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('url:', url);
  };

  return (
    <div className="url-input-wrapper">
      <div className="url-input-header">Paste url to your item</div>
      <form onSubmit={onSubmit}>
        <InputField
          type="text"
          inputName="url"
          value={url}
          onChange={onChange}
        />
        <SubmitField value="Scrap" />
      </form>
    </div>
  );
};

export default UrlInput;
