import axios from 'axios';
import { Category } from '@/data/types';

const API_BASE = '/api/category';

export const categoryService = {
  // GET all or filter by name
  async getAll(name?: string): Promise<Category[]> {
    const params = name ? { name } : {};
    const response = await axios.get<Category[]>(API_BASE, { params });
    return response.data;
  },

  // GET by ID
  async getById(id: string): Promise<Category> {
    const response = await axios.get<Category>(`${API_BASE}/${id}`);
    return response.data;
  },

  // POST new category
  async create(newCategory: Category): Promise<{ message: string }> {
    const response = await axios.post(`${API_BASE}`, newCategory);
    return response.data;
  },

  // PUT update category
  async update(id: string, updatedCategory: Category): Promise<{ message: string }> {
    const response = await axios.put(`${API_BASE}/${id}`, updatedCategory);
    return response.data;
  },

  // DELETE category
  async remove(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`${API_BASE}/${id}`);
    return response.data;
  },
};
