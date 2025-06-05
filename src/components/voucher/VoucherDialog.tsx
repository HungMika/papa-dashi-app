import { Voucher } from '@/data/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface VoucherDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucher: Voucher;
}

export default function VoucherDetail({ open, onOpenChange, voucher }: VoucherDetailProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết Voucher</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          <p>
            <strong>voucher ID:</strong> {voucher.id}
          </p>
          <p>
            <strong>Tên voucher:</strong> {voucher.name}
          </p>
          <p>
            <strong>Giảm giá:</strong> {voucher.discountPercent}%
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
