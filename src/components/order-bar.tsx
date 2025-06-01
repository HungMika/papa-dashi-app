'use client';

import { useQuery } from '@tanstack/react-query';
import { useOrder } from '@/context/OrderContext';
import { useAuthStore } from '@/services/auth-store';
import { voucherService } from '@/services/vounchers';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { saveBill } from '@/services/bills';
import { Bill, Voucher } from '@/data/types';
import { useState } from 'react';

export function OrderBar() {
  const { customerName, setCustomerName, orderItems, removeItem } = useOrder();
  const { user } = useAuthStore();

  const { data: vouchers = [] } = useQuery<Voucher[]>({
    queryKey: ['vouchers'],
    queryFn: voucherService.getAll,
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank'>('cash');
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | undefined>(undefined);

  const totalBeforeDiscount = orderItems.reduce((sum, i) => sum + i.size.price * i.quantity, 0);

  const billDiscount = selectedVoucher ? (selectedVoucher.discountPercent / 100) * totalBeforeDiscount : 0;

  const finalAmount = totalBeforeDiscount - billDiscount;

  const handleCheckout = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để thanh toán.');
      return;
    }

    const bill: Bill = {
      id: crypto.randomUUID(),
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      items: orderItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        customerName,
        quantity: item.quantity,
        price: item.size.price,
        total: item.size.price * item.quantity,
        paymentMethod,
      })),
      totalBeforeDiscount,
      itemDiscountTotal: 0,
      billDiscountAmount: billDiscount,
      voucherApplied: selectedVoucher,
      finalAmount,
    };

    await saveBill(bill);
    alert('Bill saved!');
  };

  return (
    <div className="flex flex-col h-full">
      <input
        type="text"
        placeholder="Tên khách hàng"
        className="mb-2 p-2 border rounded"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <div className="text-lg font-bold mb-4">Đơn hàng hiện tại</div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {orderItems.map((item, index) => (
          <div key={index} className="border p-2 rounded space-y-1">
            <div className="flex justify-between">
              <span>
                {item.name} ({item.size.size}) x{item.quantity}
              </span>
              <button onClick={() => removeItem(item.productId, item.size.size)} className="text-red-500 text-sm">
                Bỏ
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t pt-4 space-y-2">
        <div className="flex justify-between font-semibold">
          <span>Tổng trước giảm:</span>
          <span>{totalBeforeDiscount.toLocaleString()}₫</span>
        </div>

        <Select
          value={selectedVoucher?.id || ''}
          onValueChange={(value) => {
            if (value === '') {
              setSelectedVoucher(undefined);
            } else {
              const selected = vouchers.find((v) => v.id === value);
              setSelectedVoucher(selected);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn voucher toàn bill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">(Không áp dụng voucher)</SelectItem>
            {vouchers.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.name} (-{v.discountPercent}%)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex justify-between font-semibold">
          <span>Giảm giá:</span>
          <span>-{billDiscount.toLocaleString()}₫</span>
        </div>

        <div className="flex justify-between font-semibold">
          <span>Thành tiền:</span>
          <span>{finalAmount.toLocaleString()}₫</span>
        </div>

        <RadioGroup
          value={paymentMethod}
          onValueChange={(v) => setPaymentMethod(v as 'cash' | 'bank')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash" id="cash" />
            <label htmlFor="cash">Tiền mặt</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bank" id="bank" />
            <label htmlFor="bank">Chuyển khoản</label>
          </div>
        </RadioGroup>

        <Button className="w-full cursor-pointer" onClick={handleCheckout}>
          Thanh toán
        </Button>
      </div>
    </div>
  );
}
