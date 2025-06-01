'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Voucher, ProductSizeOption } from '@/data/types';

export interface OrderItem {
  productId: string;
  name: string;
  size: ProductSizeOption;
  quantity: number;
  appliedVoucher?: Voucher;
}

interface OrderContextProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  orderItems: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateVoucher: (productId: string, size: string, voucher: Voucher | undefined) => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [customerName, setCustomerName] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const addItem = (item: OrderItem) => {
    setOrderItems((prev) => {
      const exists = prev.some((i) => i.productId === item.productId && i.size.size === item.size.size);

      if (exists) {
        // Đã tồn tại, KHÔNG thêm gì cả
        return prev;
      } else {
        // Chưa có → thêm mới
        return [...prev, { ...item }];
      }
    });
  };

  const removeItem = (productId: string, size: string) => {
    setOrderItems((prev) => prev.filter((i) => !(i.productId === productId && i.size.size === size)));
  };

  const updateVoucher = (productId: string, size: string, voucher: Voucher | undefined) => {
    setOrderItems((prev) =>
      prev.map((i) => (i.productId === productId && i.size.size === size ? { ...i, appliedVoucher: voucher } : i)),
    );
  };

  return (
    <OrderContext.Provider value={{ customerName, setCustomerName, orderItems, addItem, removeItem, updateVoucher }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within OrderProvider');
  return context;
}
