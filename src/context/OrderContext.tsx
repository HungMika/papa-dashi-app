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
  note: string;
  setNote: (note: string) => void;
  orderItems: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateVoucher: (productId: string, size: string, voucher: Voucher | undefined) => void;
  removeAll: () => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [note, setNote] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const removeAll = () => {
    setOrderItems([]);
  };

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
    <OrderContext.Provider value={{ note, setNote, orderItems, addItem, removeItem, updateVoucher, removeAll }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within OrderProvider');
  return context;
}
