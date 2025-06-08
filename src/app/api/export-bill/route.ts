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
  { header: 'User ID', key: 'userId', width: 15 },
  { header: 'Date', key: 'date', width: 12 },
  { header: 'Time', key: 'time', width: 10 },
  { header: 'Note', key: 'note', width: 30 },
  { header: 'Ordered Items', key: 'orderedItems', width: 40 },
  {
    header: 'Before Discount',
    key: 'totalBeforeDiscount',
    width: 18,
    style: { numFmt: '#,##0" ₫"' },
  },
  {
    header: 'Item Discount',
    key: 'itemDiscountTotal',
    width: 15,
    style: { numFmt: '#,##0" ₫"' },
  },
  {
    header: 'Bill Discount',
    key: 'billDiscountAmount',
    width: 15,
    style: { numFmt: '#,##0" ₫"' },
  },
  {
    header: 'Final Amount',
    key: 'finalAmount',
    width: 15,
    style: { numFmt: '#,##0" ₫"' },
  },
];


  let totalBeforeDiscountSum = 0;
  let itemDiscountTotalSum = 0;
  let billDiscountSum = 0;
  let finalAmountSum = 0;

  bills.forEach(bill => {
    const note = bill.note || '';

    // Ordered items: "Trà sữa Matcha (x2)", "Nước ép Táo (x1)"
    const orderedItems = bill.items
      .map(item => `${item.name} (x${item.quantity})`)
      .join(', ');

    sheet.addRow({
      id: bill.id,
      userId: bill.userId,
      date: bill.date,
      time: bill.time,
      note: bill.note || '',
      orderedItems,
      totalBeforeDiscount: bill.totalBeforeDiscount,
      itemDiscountTotal: bill.itemDiscountTotal,
      billDiscountAmount: bill.billDiscountAmount || 0,
      finalAmount: bill.finalAmount,
    });

    totalBeforeDiscountSum += bill.totalBeforeDiscount;
    itemDiscountTotalSum += bill.itemDiscountTotal;
    billDiscountSum += bill.billDiscountAmount || 0;
    finalAmountSum += bill.finalAmount;
  });

  // Empty row
  sheet.addRow({});

  // Total row
  const totalRow = sheet.addRow({
    id: 'TỔNG',
    totalBeforeDiscount: totalBeforeDiscountSum,
    itemDiscountTotal: itemDiscountTotalSum,
    billDiscountAmount: billDiscountSum,
    finalAmount: finalAmountSum,
  });

  const lastRow = sheet.lastRow;
    if (lastRow) {
    lastRow.font = { bold: true };
    lastRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF99' },
    };
  }

  totalRow.font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="bills-${date}.xlsx"`,
    },
  });
}
