const ItemAsTableRow = () => {
  return (
    <tr>
      <td className="td-name">Sukienka mini maxi top okragly knited</td>
      <td className="td-shop">Zara</td>
      <td>120PLN</td>
      <td>100PLN</td>
      <td className="td-tracked">
        <input type="checkbox" className="tracked-checkbox" />
      </td>
    </tr>
  );
};

export default ItemAsTableRow;
