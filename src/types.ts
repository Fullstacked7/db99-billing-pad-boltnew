export interface Row {
  sNo: number;
  quantity: number;
  price: number;
  amount: number;
}

export interface Page {
  rows: Row[];
  total: number;
}