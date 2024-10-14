import React, { useState, useEffect, useRef } from 'react';
import BillingRow from './BillingRow';
import { Page, Row } from '../types';
import { Volume2 } from 'lucide-react';

interface BillingPadProps {
  page: Page;
  pageNumber: number;
  onUpdate: (updatedPage: Page) => void;
}

const BillingPad: React.FC<BillingPadProps> = ({ page, pageNumber, onUpdate }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const rowRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (page.rows.length === 0) {
      const initialRows: Row[] = Array.from({ length: 21 }, (_, index) => ({
        sNo: index + 1,
        quantity: 0,
        price: 0,
        amount: 0
      }));
      onUpdate({ rows: initialRows, total: 0 });
    }
  }, []);

  const updateRow = (index: number, updatedRow: Row) => {
    const updatedRows = [...page.rows];
    updatedRows[index] = updatedRow;
    const total = calculateTotal(updatedRows);
    onUpdate({ rows: updatedRows, total });
  };

  const calculateTotal = (rows: Row[]): number => {
    return rows.reduce((sum, row) => sum + row.amount, 0);
  };

  const readAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speech = new SpeechSynthesisUtterance();
    speech.lang = selectedLanguage === 'en' ? 'en-US' : 'hi-IN';
    speech.rate = 0.7; // 30% slower than normal speed
    speech.pitch = 1.1; // Slightly higher pitch for an active tone
    
    let text = selectedLanguage === 'en' ? `Page ${pageNumber}. ` : `पृष्ठ ${pageNumber}. `;
    page.rows.forEach((row) => {
      if (row.quantity !== 0 || row.price !== 0) {
        if (selectedLanguage === 'en') {
          text += `${row.quantity}, ${row.price}. `;
        } else {
          text += `${convertToHindi(row.quantity)}, ${convertToHindi(row.price)}. `;
        }
      }
    });

    speech.text = text;
    speech.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
  };

  const convertToHindi = (num: number): string => {
    const hindiNumbers = ['शून्य', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ', 'दस'];
    if (num <= 10) return hindiNumbers[num];
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Page {pageNumber}</h2>
        <div className="flex space-x-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'hi')}
            className="border border-gray-300 rounded-md shadow-sm py-1 px-2 sm:py-2 sm:px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
          <button
            onClick={readAloud}
            className={`${
              isSpeaking ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'
            } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded flex items-center text-sm`}
          >
            <Volume2 className="mr-1 sm:mr-2" size={16} />
            {isSpeaking ? 'Stop' : 'Read'}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full mb-4">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left text-sm font-medium text-gray-700">S No</th>
              <th className="p-2 text-left text-sm font-medium text-gray-700">Quantity</th>
              <th className="p-2 text-left text-sm font-medium text-gray-700">Price</th>
              <th className="p-2 text-left text-sm font-medium text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            {page.rows.map((row, index) => (
              <BillingRow
                key={index}
                row={row}
                onUpdate={(updatedRow) => updateRow(index, updatedRow)}
                inputRef={(el) => rowRefs.current[index] = el}
                onEnterPress={() => {
                  const nextIndex = index + 1;
                  if (nextIndex < page.rows.length) {
                    rowRefs.current[nextIndex]?.focus();
                  }
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-lg sm:text-xl font-bold">
        Page Total: {formatCurrency(page.total)}
      </div>
    </div>
  );
};

export default BillingPad;