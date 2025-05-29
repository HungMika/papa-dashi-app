import axios from 'axios';
import { Bill } from '@/data/types';

export async function saveBill(bill: Bill) {
  const res = await axios.post('/api/bill', bill);
  return res.data;
}

export async function getBillsByDate(date: string): Promise<Bill[]> {
  const res = await axios.get(`/api/bill?date=${date}`);
  return res.data;
}
