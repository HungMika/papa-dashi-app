import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Bill, BillItem, Voucher } from '@/data/types';

export async function POST(request: Request) {
  const reqBody = await request.json();

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = today.toTimeString().split(' ')[0]; // HH:mm:ss

  const billDir = path.resolve(process.cwd(), 'src/data/bills');
  const filePath = path.join(billDir, `bills-${dateStr}.json`);

  if (!fs.existsSync(billDir)) {
    fs.mkdirSync(billDir);
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }

  const bills = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Bill[];

  let totalBeforeDiscount = 0;
  let itemDiscountTotal = 0;
  let totalAfterItemDiscount = 0;

  const processedItems: BillItem[] = reqBody.items.map((item: any) => {
    const originalTotal = item.price * item.quantity;
    let discountedTotal = originalTotal;

    if (item.voucherApplied) {
      discountedTotal = discountedTotal * (1 - item.voucherApplied.discountPercent / 100);
      itemDiscountTotal += originalTotal - discountedTotal;
    }

    totalBeforeDiscount += originalTotal;
    totalAfterItemDiscount += discountedTotal;

    return {
      ...item,
      total: discountedTotal,
    };
  });

  const appliedBillVoucher: Voucher | undefined = reqBody.billVoucher;

  const finalAmount = appliedBillVoucher
    ? totalAfterItemDiscount * (1 - appliedBillVoucher.discountPercent / 100)
    : totalAfterItemDiscount;

  const billToSave: Bill = {
    id: uuidv4(),
    userId: reqBody.userId,
    date: dateStr,
    time: timeStr,
    items: processedItems,
    totalBeforeDiscount,
    itemDiscountTotal,
    billDiscount: appliedBillVoucher,
    finalAmount,
  };

  bills.push(billToSave);

  fs.writeFileSync(filePath, JSON.stringify(bills, null, 2));

  return NextResponse.json({ message: 'Bill saved', billId: billToSave.id });
}
