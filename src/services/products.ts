import axios from 'axios';
import { Product } from '@/data/types';

const api = axios.create({
  baseURL: '/api/product',
});

// GET all products, optionally filtered by name
export const getProducts = async (nameQuery?: string): Promise<Product[]> => {
  const params = nameQuery ? { name: nameQuery } : {};
  const response = await api.get('/', { params });
  return response.data;
};

// GET a single product by ID
export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// POST: add a new product
export const addProduct = async (newProduct: Product) => {
  const response = await api.post('/', newProduct);
  return response.data;
};

// PUT: update a product by ID
export const updateProduct = async (id: string, updatedProduct: Product) => {
  const response = await api.put(`/${id}`, updatedProduct);
  return response.data;
};

// DELETE: remove a product by ID
export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
