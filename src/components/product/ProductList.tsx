'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct } from '@/services/products';
import { Product } from '@/data/types';
import ProductItem from './ProductItem';
import toast from 'react-hot-toast';
import LoaderSpinner from '../Loader';
import { Input } from '../ui/input';
import useDebounce from '@/hooks/use-debounce';

export function useSearchState() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 300);
  return { search, setSearch, debounced };
}

export function SearchBar({ search, setSearch }: { search: string; setSearch: (value: string) => void }) {
  return (
    <Input
      placeholder="Tìm món theo tên..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full max-w-md"
    />
  );
}

export function ProdList({ search }: { search: string }) {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products', search],
    queryFn: () => getProducts(search),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Xoá món thành công');
    },
  });

  if (isLoading) return <LoaderSpinner />;
  if (products.length === 0) return <p className="text-sm text-gray-500">Không tìm thấy sản phẩm nào.</p>;

  return (
    <div className="space-y-2">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} onDelete={() => deleteMutation.mutate(product.id)} />
      ))}
    </div>
  );
}
