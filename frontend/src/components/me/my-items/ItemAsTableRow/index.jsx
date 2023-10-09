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

const ItemAsTableRow = ({ item }) => {
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
    <tr>
      <td className="td-name">
        <span onClick={openItemPage}>{item.name}</span>
      </td>
      <td className="td-shop">{item.shop}</td>
      <td>
        {updateInProgress ? (
          <div className="mini-loading"></div>
        ) : (
          <span>
            {item.price} {item.currency}
          </span>
        )}
      </td>
      <td className="td-expected-price">
        <input
          type="number"
          name="expected_price"
          value={state.expected_price ?? ''}
          onChange={onChange}
          onBlur={changeExpectedPrice}
        />
      </td>
      <td className="td-tracked">
        <div className="cell-content-flex-wrapper">
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
      </td>
      <td>
        <div className="flex-options-wrapper">
          <div className="cell-content-flex-wrapper">
            <RefreshIcon className="icon" onClick={updatePrice} />
          </div>
          <div className="cell-content-flex-wrapper">
            <BinIcon className="icon" onClick={deleteItem} />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ItemAsTableRow;
