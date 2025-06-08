'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct } from '@/services/products';
import { Product } from '@/data/types';
import ProductItem from './ProductItem';
import toast from 'react-hot-toast';
import LoaderSpinner from '../Loader';

export default function ProductList() {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Xoá món thành công');
    },
  });

  if (isLoading) return <LoaderSpinner />;
  return (
    <div className="space-y-2">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} onDelete={() => deleteMutation.mutate(product.id)} />
      ))}
    </div>
  );
}
