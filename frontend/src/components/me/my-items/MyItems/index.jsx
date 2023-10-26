import './style.css';
import ItemRow from '../ItemRow';
import { useSelector, shallowEqual } from 'react-redux';

const MyItems = () => {
  const { items } = useSelector((state) => state.items, shallowEqual);

  return (
    <div className="my-items">
      <div className="header-row">
        <div className="cell name-cell">Item</div>
        <div className="cell shop-cell">Shop</div>
        <div className="cell price-cell">Price</div>
        <div className="cell expected-price-cell">Expected price</div>
        <div className="cell tracked-cell">Tracked</div>
        <div className="cell options-cell"></div>
      </div>
      {items.map((item) => (
        <ItemRow item={item} key={item.id} />
      ))}
    </div>
  );
};

export default MyItems;
