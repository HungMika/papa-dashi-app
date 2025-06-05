'use client';

import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voucherService } from '@/services/vounchers';
import toast from 'react-hot-toast';

// ✅ Hàm kiểm tra và cập nhật phần trăm giảm giá
function handleDiscountChange(value: string, setValue: (val: number) => void) {
  const number = Number(value);
  if (isNaN(number)) {
    toast.error('Vui lòng nhập số hợp lệ');
    return;
  }
  if (number < 0) {
    toast.error('Phần trăm giảm giá không được nhỏ hơn 0');
    return;
  }
  setValue(number);
}

export default function AddVoucherDialog() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      voucherService.create({
        id,
        name,
        discountPercent,
      }),
    onSuccess: () => {
      toast.success('Thêm voucher thành công');
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      setOpen(false);
      setId('');
      setName('');
      setDiscountPercent(0);
    },
    onError: (error: any) => {
      toast.error(`Không thể thêm voucher: ${error.message}`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2 w-full cursor-pointer">+ Thêm voucher</Button>
      </DialogTrigger>

      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Thêm voucher mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Mã voucher (id)"
            disabled={mutation.isPending}
          />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên voucher"
            disabled={mutation.isPending}
          />
          <Input
            value={discountPercent}
            onChange={(e) => handleDiscountChange(e.target.value, setDiscountPercent)}
            placeholder="Phần trăm giảm giá"
            type="number"
            min={0}
            disabled={mutation.isPending}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={() => setOpen(false)} variant="outline" disabled={mutation.isPending}>
            Hủy
          </Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !id.trim() || !name.trim()}>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
