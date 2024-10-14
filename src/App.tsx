import React, { useState, useEffect } from 'react';
import BillingPad from './components/BillingPad';
import { Page } from './types';
import { saveBill, loadBill, getBillList } from './utils/storage';
import PDFExport from './components/PDFExport';
import { ArrowLeft, ArrowRight, Save, FileUp, FileDown } from 'lucide-react';

function App() {
  const [pages, setPages] = useState<Page[]>([{ rows: [], total: 0 }]);
  const [billName, setBillName] = useState('');
  const [billDate, setBillDate] = useState('');
  const [savedBills, setSavedBills] = useState<string[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    setSavedBills(getBillList());
  }, []);

  const addPage = () => {
    const newPage: Page = {
      rows: Array(21).fill(null).map((_, index) => ({
        sNo: index + 1,
        quantity: 0,
        price: 0,
        amount: 0
      })),
      total: 0
    };
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const updatePage = (pageIndex: number, updatedPage: Page) => {
    const newPages = [...pages];
    newPages[pageIndex] = updatedPage;
    setPages(newPages);
  };

  const billTotal = pages.reduce((sum, page) => sum + page.total, 0);

  const handleSave = () => {
    if (billName && billDate) {
      const fileName = `${billDate}-${billName}`;
      saveBill(fileName, { pages, billName, billDate });
      setSavedBills(getBillList());
      alert('Bill saved successfully!');
    } else {
      alert('Please enter both Bill Name and Bill Date before saving.');
    }
  };

  const handleLoad = (fileName: string) => {
    const loadedBill = loadBill(fileName);
    if (loadedBill) {
      setPages(loadedBill.pages);
      setBillName(loadedBill.billName);
      setBillDate(loadedBill.billDate);
      setCurrentPageIndex(0);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      addPage();
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
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
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:py-8 sm:px-4">
      <div className="container mx-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">DB99 Billing</h1>
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="billName" className="block text-sm font-medium text-gray-700">Bill Name</label>
              <input
                type="text"
                id="billName"
                value={billName}
                onChange={(e) => setBillName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="billDate" className="block text-sm font-medium text-gray-700">Bill Date</label>
              <input
                type="date"
                id="billDate"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
            >
              <Save className="mr-2" size={16} />
              Save Bill
            </button>
            <select
              onChange={(e) => handleLoad(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Load Saved Bill</option>
              {savedBills.map((bill) => (
                <option key={bill} value={bill}>{bill}</option>
              ))}
            </select>
            <PDFExport pages={pages} billName={billName} billDate={billDate} billTotal={billTotal} />
          </div>
        </div>
        <BillingPad
          page={pages[currentPageIndex]}
          pageNumber={currentPageIndex + 1}
          onUpdate={(updatedPage) => updatePage(currentPageIndex, updatedPage)}
        />
        <div className="mt-4 sm:mt-8 flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center"
          >
            <ArrowLeft className="mr-2" size={16} />
            Prev
          </button>
          <div className="text-lg sm:text-xl font-bold">
            Page {currentPageIndex + 1} of {pages.length}
          </div>
          <button
            onClick={handleNextPage}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            {currentPageIndex === pages.length - 1 ? 'Add' : 'Next'}
            <ArrowRight className="ml-2" size={16} />
          </button>
        </div>
        <div className="mt-4 text-xl sm:text-2xl font-bold text-center">
          Bill Total: {formatCurrency(billTotal)}
        </div>
      </div>
    </div>
  );
}

export default App;