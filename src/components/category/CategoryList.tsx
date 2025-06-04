'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category';
import { Category } from '@/data/types';
import CategoryItem from '@/components/category/CategoryItem';
import toast from 'react-hot-toast';

export default function CategoryList() {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Xoá loại hàng thành công');
    },
  });

  if (isLoading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-2 max-h-[450px] overflow-hidden">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} onDelete={() => deleteMutation.mutate(category.id)} />
      ))}
    </div>
  );
}
