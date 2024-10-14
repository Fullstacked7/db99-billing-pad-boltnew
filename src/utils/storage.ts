import { Page } from '../types';

interface SavedBill {
  pages: Page[];
  billName: string;
  billDate: string;
}

export const saveBill = (fileName: string, bill: SavedBill) => {
  localStorage.setItem(fileName, JSON.stringify(bill));
};

export const loadBill = (fileName: string): SavedBill | null => {
  const savedBill = localStorage.getItem(fileName);
  return savedBill ? JSON.parse(savedBill) : null;
};

export const getBillList = (): string[] => {
  return Object.keys(localStorage).filter(key => key.match(/^\d{4}-\d{2}-\d{2}/));
};