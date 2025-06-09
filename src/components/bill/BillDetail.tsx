'use client';

import { Bill } from '@/data/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  bills: Bill[];
}

export default function BillDetail({ open, onOpenChange, date, bills }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Chi tiết hoá đơn ngày {date}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-2">
          {bills.length === 0 && <p className="text-sm italic">Không có hoá đơn nào.</p>}

          {bills.map((bill, index) => (
            <div key={bill.id} className="mb-8 border border-gray-300 p-4 rounded-md shadow-sm">
              <div className="mb-2">
                <p className="text-sm font-semibold">
                  🧾 Hoá đơn #{index + 1} - Lúc {bill.time}
                </p>
                <p className="text-xs text-gray-500">Mã người dùng: {bill.userId}</p>
                {bill.note && <p className="text-xs italic text-muted-foreground">Ghi chú: {bill.note}</p>}
              </div>

              <Table className="mb-2">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên món</TableHead>
                    <TableHead className="text-center">SL</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                    <TableHead className="text-right">Thanh toán</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bill.items.map((item, i) => (
                    <TableRow key={`${item.productId}-${i}`}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.price.toLocaleString()}đ</TableCell>
                      <TableCell className="text-right">{item.total.toLocaleString()}đ</TableCell>
                      <TableCell className="text-right capitalize">{item.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="text-right text-sm space-y-1 mt-2">
                <div>
                  Tổng trước giảm: <strong>{bill.totalBeforeDiscount.toLocaleString()}đ</strong>
                </div>

                {bill.voucherApplied && (
                  <div>
                    Giảm giá ({bill.voucherApplied.name} -{bill.voucherApplied.discountPercent}%):{' '}
                    <strong className="text-red-600">-{bill.billDiscountAmount.toLocaleString()}đ</strong>
                  </div>
                )}

                <div className="font-bold text-base">
                  Thanh toán: <span className="text-green-700">{bill.finalAmount.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
