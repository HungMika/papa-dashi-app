// Trả về file Excel chứa danh sách hóa đơn cuối ngày
import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { Bill } from '@/data/data-types';
import fs from 'fs';
import path from 'path';

const billPath = path.resolve(process.cwd(), 'src/data/bill.json');

export async function GET() {
  const bills = JSON.parse(fs.readFileSync(billPath, 'utf8')) as Bill[];

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Bills');

  sheet.columns = [
    { header: 'Bill ID', key: 'id', width: 20 },
    { header: 'User ID', key: 'userId', width: 20 },
    { header: 'Date', key: 'date', width: 25 },
    { header: 'Total', key: 'totalAmount', width: 15 },
  ];

  bills.forEach(bill => {
    sheet.addRow({
      id: bill.id,
      userId: bill.userId,
      date: bill.date,
      totalAmount: bill.totalAmount,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="bills.xlsx"',
    },
  });
}
