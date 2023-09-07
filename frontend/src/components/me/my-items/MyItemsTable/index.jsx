import './style.css';
import ItemAsTableRow from '../ItemAsTableRow';

const MyItemsTable = () => {
  return (
    <div className="my-items">
      <table>
        <colgroup>
          <col
            style={{
              minWidth: 'var(--name-col-width)',
              maxWidth: 'var(--name-col-width)',
            }}
          />
          <col style={{ minWidth: '140px', maxWidth: '140px' }} />
          <col style={{ minWidth: '120px', maxWidth: '120px' }} />
          <col style={{ minWidth: '160px', maxWidth: '160px' }} />
          <col style={{ minWidth: '80px', maxWidth: '80px' }} />
        </colgroup>
        <thead>
          <tr>
            <th className="th-name">Item</th>
            <th className="th-shop">Shop</th>
            <th>Price</th>
            <th>Expected price</th>
            <th>Tracked</th>
          </tr>
        </thead>
        <tbody>
          <ItemAsTableRow />
          <ItemAsTableRow />
          <ItemAsTableRow />
          <ItemAsTableRow />
          <ItemAsTableRow />
        </tbody>
      </table>
    </div>
  );
};

export default MyItemsTable;
