import './style.css';
import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  useLazyScrapItemQuery,
  useLazyAddItemQuery,
} from '../../features/api/apiSlice';
import { scraperCleared } from '../../features/scraper/scraperSlice';
import { notificationShowed } from '../../features/notifications/notificationsSlice';
import InputField from '../common/form-fields/InputField';
import SubmitField from '../common/form-fields/SubmitField';
import Button from '../common/Button';
import { ReactComponent as EditIcon } from '../../svg/edit.svg';

const Scraper = () => {
  const initialValues = {
    inputUrl: '',
    url: '',
    name: '',
    shop: '',
    price: '',
    currency: '',
    expected_price: null,
    tracked: false,
    alreadyHaveThisItem: false,
  };

  const [state, setState] = useState(initialValues);

  const scraper = useSelector((state) => state.scraper.item);

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (scraper.name) {
      setState({ ...state, ...scraper });
    }
  }, []);

  const { items } = useSelector((state) => state.items);

  const [scrapItemQuery, { isFetching }] = useLazyScrapItemQuery();

  const [addItemQuery] = useLazyAddItemQuery();

  const dispatch = useDispatch();

  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const onCheckboxChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.checked });

  const showNameInput = () => {
    document.getElementById('name-span').style.display = 'none';
    document.getElementById('edit-name-icon').style.display = 'none';
    const nameInputWrapper = document.getElementById('name-input-wrapper');
    nameInputWrapper.style.display = 'block';
    document.getElementById('name-input').focus();
  };

  const hideNameInput = () => {
    document.getElementById('name-span').style.display = 'initial';
    document.getElementById('edit-name-icon').style.display = 'initial';
    const nameInputWrapper = document.getElementById('name-input-wrapper');
    nameInputWrapper.style.display = 'none';
  };

  const openItemPage = () => {
    window.open(state.url);
  };

  const onScrap = (e) => {
    e.preventDefault();

    if (state.inputUrl === state.url) return;

    dispatch(scraperCleared());

    const myItem = items.find((x) => x.url === state.inputUrl);
    if (myItem) {
      setState({ ...state, alreadyHaveThisItem: true, name: '' });
    } else {
      setState({ ...state, alreadyHaveThisItem: false, name: '' });
      scrapItem();
    }
  };

  const scrapItem = async () => {
    const { data: item, isError } = await scrapItemQuery(state.inputUrl);
    if (!isError) {
      setState({
        ...state,
        inputUrl: '',
        alreadyHaveThisItem: false,
        ...item,
      });
    }
  };

  const addItemToMyList = async (e) => {
    if (!isAuthenticated) {
      dispatch(
        notificationShowed({
          status: '401',
          detail:
            "Didn't you forget about something?\nYou have to log in first...",
        })
      );
      return;
    }
    const { inputUrl, ...data } = state;
    const { isError } = await addItemQuery(data);
    if (!isError) {
      setState(initialValues);
    }
  };

  return (
    <Fragment>
      <div className="url-input-wrapper">
        <div className="url-input-header">Paste url to your item</div>
        <form onSubmit={onScrap}>
          <InputField
            type="text"
            inputName="inputUrl"
            value={state.inputUrl}
            onChange={onChange}
            required={true}
          />
          <SubmitField value="Get item" />
        </form>
        {state.alreadyHaveThisItem && (
          <div className="item-already-exist-info">
            You already have this item on your list.
          </div>
        )}
      </div>
      {isFetching && <div className="loading"></div>}
      {state.name && (
        <div className="scrapped-data-wrapper">
          <div className="scrapped-data">
            <div className="item-data">
              <div className="sd-item sd-name">
                <div className="sd-label">Name</div>
                <div className="sd-value" id="sd-value-name">
                  <span id="name-span" onClick={openItemPage}>
                    {state.name}
                  </span>
                  <EditIcon
                    id="edit-name-icon"
                    className="edit-name-icon"
                    onClick={showNameInput}
                  />
                  <div
                    id="name-input-wrapper"
                    className="form-field name-input-wrapper"
                  >
                    <input
                      id="name-input"
                      type="text"
                      name="name"
                      value={state.name}
                      onChange={onChange}
                      required
                      onBlur={hideNameInput}
                    />
                  </div>
                </div>
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
                  checked={state.tracked}
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
                  name="expected_price"
                  value={state.expected_price ?? ''}
                  onChange={onChange}
                  min="0"
                />
              </div>
            </div>
          </div>
          <div className="sd-options">
            <Button value="Add item to my list" onClick={addItemToMyList} />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Scraper;
