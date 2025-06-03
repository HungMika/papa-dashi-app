'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category } from '@/data/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category';
import toast from 'react-hot-toast';

interface EditCategoryDialogProps {
  category: Category;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export default function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
  const [name, setName] = useState(category.name);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setName(category.name);
    }
  }, [open, category]);

  const mutation = useMutation<{ message: string }, Error, void>({
    mutationFn: () => categoryService.update(category.id, { ...category, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Cập nhật loại hàng thành công');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Cập nhật loại hàng thất bại: ${error.message}`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa loại hàng</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input value={category.id} disabled />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên loại hàng"
            disabled={mutation.isPending}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={() => onOpenChange(false)} variant="outline" disabled={mutation.isPending}>
            Hủy
          </Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
