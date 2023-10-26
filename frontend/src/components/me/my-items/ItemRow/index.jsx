import './style.css';
import { useState, useEffect } from 'react';
import {
  useLazyDeleteItemQuery,
  useLazyEditExpectedPriceQuery,
  useLazyEditTrackingStatusQuery,
  useLazyUpdatePriceQuery,
} from '../../../../features/api/apiSlice';
import { ReactComponent as BinIcon } from '../../../../svg/bin.svg';
import { ReactComponent as RefreshIcon } from '../../../../svg/refresh.svg';

const ItemRow = ({ item }) => {
  const [state, setState] = useState(item);

  useEffect(() => {
    setState(item);
  }, [item]);

  const [deleteItemQuery] = useLazyDeleteItemQuery();
  const [updatePriceQuery, { isFetching: updateInProgress }] =
    useLazyUpdatePriceQuery();
  const [editExpectedPriceQuery] = useLazyEditExpectedPriceQuery();
  const [editTrackingStatusQuery] = useLazyEditTrackingStatusQuery();

  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const changeExpectedPrice = async () => {
    await editExpectedPriceQuery(state);
  };

  const changeTrackingStatus = async (e) => {
    await editTrackingStatusQuery({
      ...state,
      tracked: !state.tracked,
    });
  };

  const deleteItem = async () => {
    await deleteItemQuery(state.id);
  };

  const updatePrice = async () => {
    await updatePriceQuery(state.id);
  };

  const openItemPage = () => {
    window.open(item.url);
  };

  return (
    <div className="item-row">
      <div className="cell-wrapper">
        <div className="cell-title">Item</div>
        <div className="cell name-cell">
          <span onClick={openItemPage}>{item.name}</span>
        </div>
      </div>

      <div className="full-width-wrapper middle-wrapper">
        <div className="cell-wrapper shop-cell-wrapper">
          <div className="cell-title">Shop</div>
          <div className="cell shop-cell">{item.shop}</div>
        </div>
        <div className="cell-wrapper price-cell-wrapper">
          <div className="cell-title">Price</div>
          <div className="cell price-cell">
            {updateInProgress ? (
              <div className="mini-loading"></div>
            ) : (
              <span>
                {item.price} {item.currency}
              </span>
            )}
          </div>
        </div>
        <div className="cell-wrapper expected-price-wrapper">
          <div className="cell-title">Expected price</div>
          <div className="cell expected-price-cell">
            <input
              type="number"
              name="expected_price"
              value={state.expected_price ?? ''}
              onChange={onChange}
              onBlur={changeExpectedPrice}
            />
          </div>
        </div>
      </div>
      <div className="full-width-wrapper">
        <div className="cell-wrapper">
          <div className="cell-title">Tracked</div>
          <div className="cell tracked-cell">
            <label className="checkbox-toggle">
              <input
                type="checkbox"
                name="tracked"
                checked={state.tracked}
                onChange={changeTrackingStatus}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <div className="cell options-cell">
          <div className="cell-content-flex-wrapper">
            <RefreshIcon className="icon" onClick={updatePrice} />
          </div>
          <div className="cell-content-flex-wrapper">
            <BinIcon className="icon" onClick={deleteItem} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemRow;
