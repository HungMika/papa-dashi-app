import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { Bill } from '@/data/types';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ message: 'Date query is required' }, { status: 400 });
  }

  const filePath = path.resolve(process.cwd(), 'src/data/bills', `bills-${date}.json`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ message: 'No bills for this date' }, { status: 404 });
  }

  const bills = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Bill[];

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Bills');

  sheet.columns = [
    { header: 'Bill ID', key: 'id', width: 20 },
    { header: 'User ID', key: 'userId', width: 20 },
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Time', key: 'time', width: 10 },
    { header: 'Customer Names', key: 'customerNames', width: 30 },
    { header: 'Before Discount', key: 'totalBeforeDiscount', width: 15 },
    { header: 'Item Discount', key: 'itemDiscountTotal', width: 15 },
    { header: 'Final Amount', key: 'finalAmount', width: 15 },
  ];

  let totalBeforeDiscountSum = 0;
  let itemDiscountTotalSum = 0;
  let finalAmountSum = 0;

  bills.forEach(bill => {
    const customerNames = bill.items.map(item => item.customerName).join(', ');
    sheet.addRow({
      id: bill.id,
      userId: bill.userId,
      date: bill.date,
      time: bill.time,
      customerNames,
      totalBeforeDiscount: bill.totalBeforeDiscount,
      itemDiscountTotal: bill.itemDiscountTotal,
      finalAmount: bill.finalAmount,
    });

    totalBeforeDiscountSum += bill.totalBeforeDiscount;
    itemDiscountTotalSum += bill.itemDiscountTotal;
    finalAmountSum += bill.finalAmount;
  });

  // Thêm một hàng tổng ở cuối bảng
  sheet.addRow({}); // hàng trống để phân cách

  sheet.addRow({
    id: 'TỔNG',
    totalBeforeDiscount: totalBeforeDiscountSum,
    itemDiscountTotal: itemDiscountTotalSum,
    finalAmount: finalAmountSum,
  });

  // Optional: format hàng tổng (in đậm)
  const lastRow = sheet.lastRow;
  if (lastRow) {
    lastRow.font = { bold: true };
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="bills-${date}.xlsx"`,
    },
  });
}
