'use client';

import { useQuery } from '@tanstack/react-query';
import { OrderBar } from '@/components/order-bar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { getProducts } from '@/services/products';
import { categoryService } from '@/services/category';
import ProductCard from '@/components/Product';
import { Product, Category } from '@/data/types';
import { OrderProvider } from '@/context/OrderContext';

export default function DashboardPage() {
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: () => getProducts(),
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
      <div className="flex min-h-screen">
        {/* Phần giữa: header + main */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="bg-green-500 px-6 py-4 flex items-center justify-between">
            <h2 className="text-white text-xl font-bold">Dashboard</h2>

            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input placeholder="Tìm kiếm sản phẩm..." className="pl-10 bg-white" />
            </div>
          </div>

          {/* Category buttons */}
          <div className="w-full px-4 py-2 border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-2">
              {isLoadingCategories && <span>Loading categories...</span>}
              {isErrorCategories && <span>Failed to load categories.</span>}
              {categories?.map((category) => (
                <Button key={category.id} variant="outline" className="shrink-0">
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 bg-gray-100 overflow-auto">
            {isLoadingProducts && <div>Loading products...</div>}
            {isErrorProducts && <div>Failed to load products.</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* OrderBar */}
        <div className="w-80 bg-white border-l border-gray-300 p-4 flex flex-col">
          <OrderBar />
        </div>
      </div>
    </OrderProvider>
  );
}
