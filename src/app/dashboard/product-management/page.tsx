import CategoryList from '@/components/category/CategoryList';
import AddCategoryDialog from '@/components/category/AddCategoryDialog';
import { Button } from '@/components/ui/button';
import ProductList from '@/components/product/ProductList';
import AddProductDialog from '@/components/product/AddProductDialog';
import VoucherList from '@/components/voucher/VoucherList';
import AddVoucherDialog from '@/components/voucher/AddVoucherDialog';

export default function ManagementProductPage() {
  return (
    <div className="flex flex-1 min-h-0">
      {/* Phần giữa: header + main */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="bg-green-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Quản lý sản phẩm</h2>
        </div>

        {/* Main content */}
        <div className="flex h-[calc(100vh-80px)] px-2 py-6 gap-2">
          {/* Sidebar trái - Category */}
          <div className="w-1/5 bg-white rounded shadow p-3 flex flex-col">
            <h2 className="text-lg font-bold mb-2">Loại hàng</h2>
            <div className="flex-1 overflow-y-auto space-y-2">
              <CategoryList />
            </div>
            <AddCategoryDialog />
          </div>

          {/* Giữa - Product List */}
          <div className="flex-1 bg-white rounded shadow p-3 flex flex-col">
            <h2 className="text-lg font-bold mb-2">Danh sách món</h2>
            <div className="flex-1 overflow-y-auto space-y-2">
              <ProductList />
            </div>
            <AddProductDialog />
          </div>

          {/* Phải - Voucher List */}
          <div className="w-1/5 bg-white rounded shadow p-3 flex flex-col">
            <h2 className="text-lg font-bold mb-2">Voucher</h2>
            <div className="flex-1 overflow-y-auto space-y-2">
              <VoucherList />
            </div>
            <AddVoucherDialog />{' '}
          </div>
        </div>
      </div>
    </div>
  );
}
