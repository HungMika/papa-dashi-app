// src/types.ts
export interface Category {
  id: string;
  name: string;
}

export interface ProductSizeOption {
  size: string;
  price: number;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  imagePath: string;
  unit: string;
  categoryId: string;
  sizes: ProductSizeOption[];
}

export interface Voucher {
  id: string;
  name: string;
  discountPercent: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface BillItem {
  productId: string;
  name: string;
  customerName: string;
  quantity: number;
  price: number;
  total: number;
  paymentMethod: 'cash' | 'bank';
  voucherApplied?: Voucher;
}

export interface Bill {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  items: BillItem[];
  totalBeforeDiscount: number;
  itemDiscountTotal: number;
  billDiscountAmount: number;   
  voucherApplied?: Voucher;
  finalAmount: number;
}
