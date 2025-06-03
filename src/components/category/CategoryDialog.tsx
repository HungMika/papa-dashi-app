import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Category } from '@/data/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
}

export default function CategoryDialog({ open, onOpenChange, category }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết loại hàng</DialogTitle>
          <DialogDescription>Thông tin về loại hàng đã chọn.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          <p>
            <strong>ID:</strong> {category.id}
          </p>
          <p>
            <strong>Tên:</strong> {category.name}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
