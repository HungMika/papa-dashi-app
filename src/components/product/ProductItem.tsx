import { Product } from '@/data/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import ProductDialog from '@/components/product/ProductDetail';
import { useConfirm } from '@/hooks/use-confirm';

interface Props {
  product: Product;
  onDelete: () => void;
}

export default function ProductItem({ product, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm('Xác nhận xoá', `Bạn có chắc muốn xoá món "${product.name}" không?`);

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) onDelete();
  };

  return (
    <>
      <div
        className="border p-2 rounded flex justify-between items-center cursor-pointer hover:bg-gray-100"
        onClick={() => setOpen(true)}
      >
        <span>{product.name}</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer hover:text-blue-600 transition-transform duration-150 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Mở Edit Dialog sau
              console.log('Sửa món:', product.id);
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer hover:text-rose-600 transition-transform duration-150 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash2 size={16} className="text-red-500" />
          </Button>
        </div>
      </div>

      <ProductDialog open={open} onOpenChange={setOpen} product={product} />
      <ConfirmDialog />
    </>
  );
}
