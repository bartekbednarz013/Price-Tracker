import './style.css';
import ItemRow from '../ItemRow';
import { useSelector, shallowEqual } from 'react-redux';

const MyItems = () => {
  const { items } = useSelector((state) => state.items, shallowEqual);

  return (
    <div className="my-items">
      <div className="header-row">
        <div className="header-cell name-header-cell">Item</div>
        <div className="header-cell shop-header-cell">Shop</div>
        <div className="header-cell price-header-cell">Price</div>
        <div className="header-cell expected-price-header-cell">
          Expected price
        </div>
        <div className="header-cell tracked-header-cell">Tracked</div>
        <div className="header-cell options-header-cell"></div>
      </div>
      {items.map((item) => (
        <ItemRow item={item} key={item.id} />
      ))}
    </div>
  );
};

export default MyItems;
