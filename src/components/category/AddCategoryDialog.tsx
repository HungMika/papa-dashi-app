'use client';

import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category';
import toast from 'react-hot-toast';

export default function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => categoryService.create({ id, name }),
    onSuccess: () => {
      toast.success('Thêm loại hàng thành công');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setOpen(false);
      setId('');
      setName('');
    },
    onError: () => {
      toast.error('Không thể thêm loại hàng. ID có thể đã tồn tại.');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2 w-full cursor-pointer">+ Thêm loại</Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Thêm loại hàng mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Mã loại (id)"
            disabled={mutation.isPending}
          />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên loại hàng"
            disabled={mutation.isPending}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button
            className="cursor-pointer"
            onClick={() => setOpen(false)}
            variant="outline"
            disabled={mutation.isPending}
          >
            Hủy
          </Button>
          <Button
            className="cursor-pointer"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !id || !name}
          >
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
