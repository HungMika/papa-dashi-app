import AddCategoryDialog from '@/components/category/AddCategoryDialog';
import ProductWrapper from '@/components/product/ProductWrapper'; // mới tách
import AddProductDialog from '@/components/product/AddProductDialog';
import AddVoucherDialog from '@/components/voucher/AddVoucherDialog';
import VoucherWrapper from '@/components/voucher/VoucherWrapper';
import CategoryWrapper from '@/components/category/ategoryWrapper';

export default function ManagementProductPage() {
  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex flex-col flex-1">
        <div className="bg-green-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Quản lý sản phẩm</h2>
        </div>

        <div className="flex h-[calc(100vh-80px)] px-2 py-6 gap-2">
          <div className="w-1/5 bg-white rounded shadow p-3 flex flex-col">
            <h2 className="text-lg font-bold mb-2">Loại hàng</h2>
            <CategoryWrapper />
            <AddCategoryDialog />
          </div>

          <div className="flex-1 bg-white rounded shadow p-3 flex flex-col">
            <h2 className="text-lg font-bold mb-2">Danh sách món</h2>
            <ProductWrapper />
            <AddProductDialog />
          </div>

          <div className="w-1/5 bg-white rounded shadow p-3 flex flex-col">
            <h2 className="text-lg font-bold mb-2">Voucher</h2>
            <VoucherWrapper />
            <AddVoucherDialog />
          </div>
        </div>
      </div>
    </div>
  );
}
