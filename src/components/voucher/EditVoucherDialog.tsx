'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Voucher } from '@/data/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voucherService } from '@/services/vounchers';
import toast from 'react-hot-toast';

interface EditVoucherDialogProps {
  voucher: Voucher;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

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

export default function EditVoucherDialog({ voucher, open, onOpenChange }: EditVoucherDialogProps) {
  const [name, setName] = useState(voucher.name);
  const [discountPercent, setDiscountPercent] = useState(voucher.discountPercent);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setName(voucher.name);
      setDiscountPercent(voucher.discountPercent);
    }
  }, [open, voucher]);

  const mutation = useMutation<string, Error, void>({
    mutationFn: () => voucherService.update(voucher.id, { ...voucher, name, discountPercent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Cập nhật voucher thành công');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Cập nhật voucher thất bại: ${error.message}`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa loại hàng</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input value={voucher.id} disabled />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên loại hàng"
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
