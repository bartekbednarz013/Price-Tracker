import './style.css';
import { useState } from 'react';
import Button from '../../common/Button';
import axios from 'axios';

const ScrapedData = (scrapedData) => {
  const initialValues = {
    name: 'Sukienka maxi',
    shop: 'Mango',
    url: 'http:mango.com/pl/sukienka-maxi',
    price: 149,
    currency: 'PLN',
    expectedPrice: null,
    tracked: false,
  };

  const [state, setState] = useState(initialValues);

  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const onCheckboxChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.checked });

  const addItemToMyList = (e) => {
    let data = {
      ...state,
      price: parseFloat(state.price),
      expected_price: parseFloat(state.expectedPrice),
    };

    axios
      .post('http://127.0.0.1:8000/items', data)
      .then((res) => {
        console.log('dodano');
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div className="scrapped-data-wrapper">
      <div className="scrapped-data">
        <div className="item-data">
          <div className="sd-item sd-name">
            <div className="sd-label">Name</div>
            <div className="sd-value">{state.name}</div>
          </div>
          <div className="sd-item sd-shop">
            <div className="sd-label">Shop</div>
            <div className="sd-value">{state.shop}</div>
          </div>
          <div className="sd-item sd-price">
            <div className="sd-label">Price</div>
            <div className="sd-value">
              {state.price} {state.currency}
            </div>
          </div>
        </div>
      </div>
      <div className="item-options">
        <div className="option-field">
          <div className="option-title">Tracked:</div>
          <label className="checkbox-toggle">
            <input
              type="checkbox"
              id="tracked-checkbox"
              name="tracked"
              value={state.tracked}
              onChange={onCheckboxChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="option-field">
          <div className="option-title">Expected price:</div>
          <div className="form-field">
            <input
              type="number"
              name="expectedPrice"
              value={state.expectedPrice ?? ''}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <div className="sd-options">
        <Button value="Add to my list" onClick={addItemToMyList} />
      </div>
    </div>
  );
};

export default ScrapedData;
