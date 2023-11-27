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
import CheckboxToggle from '../common/CheckboxToggle';

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
    fromStore: false,
  };

  const [state, setState] = useState(initialValues);

  const scraper = useSelector((state) => state.scraper.item);

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (scraper.name) {
      setState({ ...state, ...scraper, fromStore: true });

      document
        .getElementById('url-input-wrapper')
        .classList.add('with-scrapped-data');
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
    document.getElementById('name-wrapper').style.zIndex = '-1';
    document.getElementById('name-wrapper').style.opacity = '0';
    document.getElementById('name-input-wrapper').style.display = 'block';
    document.getElementById('name-input').focus();
  };

  const hideNameInput = () => {
    document.getElementById('name-wrapper').style.zIndex = 'initial';
    document.getElementById('name-wrapper').style.opacity = 'initial';
    document.getElementById('name-input-wrapper').style.display = 'none';
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
      setState({
        ...state,
        alreadyHaveThisItem: true,
        name: '',
        fromStore: false,
      });
    } else {
      setState({
        ...state,
        alreadyHaveThisItem: false,
        name: '',
        fromStore: false,
      });
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
      document
        .getElementById('url-input-wrapper')
        .classList.add('with-scrapped-data');
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
    if (data.expected_price === '') {
      data.expected_price = null;
    }
    const { isError } = await addItemQuery(data);
    if (!isError) {
      setState(initialValues);
      document
        .getElementById('url-input-wrapper')
        .classList.remove('with-scrapped-data');
    }
  };

  return (
    <Fragment>
      <div id="url-input-wrapper" className="url-input-wrapper">
        <div className="url-input-header">Paste url to your item</div>
        <div className="scraper-show-hint">i</div>
        <div id="scraper-hint" className="scraper-hint">
          <div className="scraper-hint-corner"></div>
          To track item you have to create account and add item to yout list.
          You will receive email notification every time price of your item
          drops. You can also set expected price and we will inform you only
          when item reaches indicated price.
          <br />
          <div className="shop-list-wrapper">
            Price tracker works with shops:
            <div className="shop-list">
              <li>Zara</li>
              <li>Mango</li>
              <li>H&M</li>
              <li>Reserved</li>
              <li>noszesztuke</li>
              <li>factcool</li>
              <li>Bossino</li>
              <li>TRIPLÉS</li>
              <li>HIBOU</li>
              <li>MARSALA</li>
              <li>camelie</li>
              <li>Zalando</li>
              <li>SKIMS</li>
              <li>ALOHAS</li>
            </div>
          </div>
        </div>
        <form onSubmit={onScrap}>
          <InputField
            type="text"
            name="inputUrl"
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
        <div
          id="scrapped-data-wrapper"
          className={
            'scrapped-data-wrapper' +
            (state.fromStore ? ' recovered-from-store' : ' fade-in')
          }
        >
          <div className="scrapped-data">
            <div className="item-data">
              <div className="sd-item sd-name">
                <div className="sd-label">Name</div>
                <div className="sd-value" id="sd-value-name">
                  <span id="name-wrapper">
                    <span id="name-span" onClick={openItemPage}>
                      {state.name}
                    </span>
                    <EditIcon
                      id="edit-name-icon"
                      className="edit-name-icon"
                      onClick={showNameInput}
                    />
                  </span>
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
                  {state.price.toFixed(2)} {state.currency}
                </div>
              </div>
            </div>
          </div>
          <div className="item-options">
            <div className="option-field">
              <div className="option-title">Tracked:</div>
              <CheckboxToggle
                id="tracked-checkbox"
                name="tracked"
                checked={state.tracked}
                onChange={onCheckboxChange}
              />
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
            <Button
              value="Add item to my list"
              onClick={addItemToMyList}
              disabled={!isAuthenticated}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Scraper;
