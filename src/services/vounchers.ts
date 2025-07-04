// src/services/vounchers.ts
import axios from 'axios';
import { Voucher } from '@/data/types';

const baseUrl = '/api/voucher';

export const voucherService = {
  async getAll(name?: string): Promise<Voucher[]> {
    const params: Record<string, string> = {};
    if (name) params.name = name;

    const res = await axios.get(baseUrl, { params });
    return res.data;
  },

  async create(voucher: Voucher): Promise<string> {
    try {
      const res = await axios.post(baseUrl, voucher);
      return res.data.message;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create voucher');
    }
  },

  async update(id: string, voucher: Voucher): Promise<string> {
    try {
      const res = await axios.put(`${baseUrl}/${id}`, voucher);
      return res.data.message;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update voucher');
    }
  },

  async delete(id: string): Promise<string> {
    try {
      const res = await axios.delete(`${baseUrl}/${id}`);
      return res.data.message;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete voucher');
    }
  }
};
