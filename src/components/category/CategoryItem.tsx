import { Category } from '@/data/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import CategoryDialog from '@/components/category/CategoryDialog';
import { useConfirm } from '@/hooks/use-confirm';
import EditCategoryDialog from './EditCategoryDialog';

interface Props {
  category: Category;
  onDelete: () => void;
}

export default function CategoryItem({ category, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [ConfirmDialog, confirm] = useConfirm('Xác nhận xoá', `Bạn có chắc muốn xoá loại "${category.name}" không?`);

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
        <span>{category.name}</span>
        <div className="flex gap-1 ">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer hover:text-blue-600 transition-transform duration-150 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              setOpenEdit(true);
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            className="cursor-pointer hover:text-red-500 transition-transform duration-150 hover:scale-110"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash2 size={16} className="text-red-500" />
          </Button>
        </div>
      </div>

      <CategoryDialog open={open} onOpenChange={setOpen} category={category} />
      <EditCategoryDialog category={category} open={openEdit} onOpenChange={setOpenEdit} />
      <ConfirmDialog />
    </>
  );
}
