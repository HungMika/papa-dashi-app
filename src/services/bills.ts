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

export async function fetchBillDates(): Promise<string[]> {
  const res = await axios.get('/api/bill/list');
  return res.data.files;
}

export async function downloadBillExcel(date: string): Promise<Blob> {
  const res = await axios.get(`/api/export-bill?date=${date}`, {
    responseType: 'blob',
  });
  return res.data;
}
