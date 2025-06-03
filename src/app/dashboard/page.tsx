'use client';

import { useQuery } from '@tanstack/react-query';
import { OrderBar } from '@/components/order-bar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RotateCcw, Search } from 'lucide-react';
import { getProducts } from '@/services/products';
import { categoryService } from '@/services/category';
import ProductCard from '@/components/Product';
import { Product, Category } from '@/data/types';
import { OrderProvider } from '@/context/OrderContext';
import { useState } from 'react';
import useDebounce from '@/hooks/use-debounce';

export default function DashboardPage() {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 500);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery<Product[], Error>({
    queryKey: ['products', debouncedSearch, selectedCategoryId],
    queryFn: () => getProducts(debouncedSearch, selectedCategoryId ?? undefined),
  });

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  return (
    <OrderProvider>
      <div className="flex flex-1 min-h-0">
        {/* Phần giữa: header + main */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="bg-green-500 px-6 py-4 flex items-center justify-between">
            <h2 className="text-white text-xl font-bold">Dashboard</h2>

            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 bg-white"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter Box */}
          <div className="w-full px-4 py-2 border-b border-gray-200">
            <p className="font-medium text-gray-700 mb-2">Lọc theo loại món</p>

            <div className="flex items-center gap-2 overflow-x-auto border border-gray-300 rounded-full px-3 py-2 bg-white">
              <Button
                variant="default"
                size="sm"
                onClick={() => setSelectedCategoryId(null)}
                disabled={!selectedCategoryId}
                className="shrink-0 bg-blue-500 rounded-full hover:bg-blue-600 text-white cursor-pointer"
              >
                <RotateCcw size={16} />
              </Button>

              {isLoadingCategories && <span>Đang tải...</span>}
              {isErrorCategories && <span>Lỗi khi tải danh mục</span>}

              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategoryId === category.id ? 'default' : 'outline'}
                  className="shrink-0 rounded-full cursor-pointer"
                  onClick={() => setSelectedCategoryId((prev) => (prev === category.id ? null : category.id))}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 bg-gray-100 max-h-[550px] overflow-y-auto border-black">
            {isLoadingProducts && <div>Loading products...</div>}
            {isErrorProducts && <div>Failed to load products.</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* OrderBar */}
        <div className="w-80 bg-white border-l border-gray-300 p-4 flex flex-col min-h-screen">
          <OrderBar />
        </div>
      </div>
    </OrderProvider>
  );
}
