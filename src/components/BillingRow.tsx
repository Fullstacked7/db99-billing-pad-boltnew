import React, { useRef } from 'react';
import { Row } from '../types';

interface BillingRowProps {
  row: Row;
  onUpdate: (updatedRow: Row) => void;
  inputRef: (el: HTMLInputElement | null) => void;
  onEnterPress: () => void;
}

const BillingRow: React.FC<BillingRowProps> = ({ row, onUpdate, inputRef, onEnterPress }) => {
  const priceInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedRow = { ...row, [name]: parseFloat(value) || 0 };
    updatedRow.amount = updatedRow.quantity * updatedRow.price;
    onUpdate(updatedRow);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, isQuantity: boolean) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isQuantity) {
        priceInputRef.current?.focus();
      } else {
        onEnterPress();
      }
    }
  };

  return (
    <tr>
      <td className="p-2">{row.sNo}</td>
      <td className="p-2">
        <input
          type="number"
          name="quantity"
          value={row.quantity || ''}
          onChange={handleChange}
          onKeyPress={(e) => handleKeyPress(e, true)}
          ref={inputRef}
          className="w-full p-1 border rounded"
        />
      </td>
      <td className="p-2">
        <input
          type="number"
          name="price"
          value={row.price || ''}
          onChange={handleChange}
          onKeyPress={(e) => handleKeyPress(e, false)}
          ref={priceInputRef}
          className="w-full p-1 border rounded"
        />
      </td>
      <td className="p-2">${row.amount.toFixed(2)}</td>
    </tr>
  );
};

export default BillingRow;