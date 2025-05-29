import { OrderBar } from '@/components/order-bar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      {/* Phần giữa: header + main */}
      <div className="flex flex-col flex-1">
        {/* Header (chỉ chạy từ mép sidebar đến mép orderbar) */}
        <div className="bg-green-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Dashboard</h2>

          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input placeholder="Tìm kiếm sản phẩm..." className="pl-10 bg-white" />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <p className="text-lg mb-6">Welcome to your dashboard!</p>

          <div className="space-y-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Thêm Trà Sữa</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded">Thêm Bánh Ngọt</button>
          </div>
        </div>
      </div>

      {/* OrderBar (cố định phải, full height) */}
      <div className="w-80 bg-white border-l border-gray-300 p-4 flex flex-col">
        <OrderBar />
      </div>
    </div>
  );
}
