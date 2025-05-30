'use client';

import { useQuery } from '@tanstack/react-query';
import { OrderBar } from '@/components/order-bar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { getProducts } from '@/services/products';
import ProductCard from '@/components/Product';
import { Product } from '@/data/types';

export default function DashboardPage() {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  return (
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

        {/* Main content */}
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <p className="text-lg mb-6">Welcome to your dashboard!</p>

          {isLoading && <div>Loading products...</div>}
          {isError && <div>Failed to load products.</div>}

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
  );
}
