'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category';
import { Category } from '@/data/types';
import CategoryItem from '@/components/category/CategoryItem';
import toast from 'react-hot-toast';
import LoaderSpinner from '../Loader';
import { Input } from '../ui/input';
import useDebounce from '@/hooks/use-debounce';
import { useState } from 'react';

export function useSearchCategoryState() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 300);
  return { search, setSearch, debounced };
}

export function CategorySearchBar({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  return (
    <Input
      placeholder="Tìm loại hàng theo tên..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full max-w-md"
    />
  );
}

export function CategoryListContent({ search }: { search: string }) {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories', search],
    queryFn: () => categoryService.getAll(search),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Xoá loại hàng thành công');
    },
  });

  if (isLoading) return <LoaderSpinner />;
  if (categories.length === 0) return <p className="text-sm text-gray-500">Không tìm thấy loại hàng nào.</p>;

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} onDelete={() => deleteMutation.mutate(category.id)} />
      ))}
    </div>
  );
}
