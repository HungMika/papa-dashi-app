'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBillDates, downloadBillExcel } from '@/services/bills';
import { Loader2, Sheet } from 'lucide-react'; // 👈 import icon
import toast from 'react-hot-toast';
import LoaderSpinner from '@/components/Loader';
import { getBillsByDate } from '@/services/bills';
import BillDetailDialog from '@/components/bill/BillDetail';
import { Bill } from '@/data/types';

export default function BillManagementPage() {
  const {
    data: billDates = [],
    isLoading,
    error,
  } = useQuery<string[], Error>({
    queryKey: ['billDates'],
    queryFn: fetchBillDates,
  });

  const [loadingDate, setLoadingDate] = useState<string | null>(null); // 👈 track loading file
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDetailDialog = async (date: string) => {
    try {
      const bills = await getBillsByDate(date);
      setBills(bills);
      setSelectedDate(date);
      setDialogOpen(true);
    } catch (err) {
      toast.error('Không thể tải chi tiết hoá đơn.');
    }
  };

  const downloadExcel = async (date: string) => {
    try {
      setLoadingDate(date); // start loading
      const blob = await downloadBillExcel(date);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bills-${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Không thể tải file Excel.');
    } finally {
      setLoadingDate(null); // end loading
    }
  };

  const formatDateToDisplay = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

  if (isLoading)
    return (
      <LoaderSpinner className="h-full flex items-center justify-center" message="Đang tải danh sách hoá đơn..." />
    );
  if (error) return <p>Có lỗi khi tải danh sách hoá đơn.</p>;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="bg-green-500 px-6 py-4 flex items-center justify-between">
        <h2 className="text-white text-xl font-bold">Danh sách hoá đơn</h2>
      </div>

      <div className="mt-4 p-2 border-gray-300 rounded-b-md">
        {billDates.length === 0 && <p>Chưa có hoá đơn nào.</p>}

        <ul className="space-y-2 max-h-[400px] overflow-y-auto">
          {billDates.map((date) => (
            <li key={date} className="flex justify-between items-center border border-gray-400 p-3 rounded-md shadow">
              <span className="hover:underline text-blue-700 cursor-pointer" onClick={() => openDetailDialog(date)}>
                Hoá đơn ngày: {formatDateToDisplay(date)}
              </span>
              <button
                onClick={() => downloadExcel(date)}
                className="bg-green-600 p-2 rounded-full text-white font-semibold hover:bg-green-700 transition cursor-pointer flex items-center justify-center w-9 h-9"
                title="Tải hoá đơn"
                disabled={loadingDate === date}
              >
                {loadingDate === date ? <Loader2 className="animate-spin w-5 h-5" /> : <Sheet className="w-5 h-5" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedDate && (
        <BillDetailDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          date={formatDateToDisplay(selectedDate)}
          bills={bills}
        />
      )}
    </div>
  );
}
