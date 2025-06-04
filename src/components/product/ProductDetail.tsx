import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product } from '@/data/types';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export default function ProductDialog({ open, onOpenChange, product }: Props) {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const categoryName = categories.find((c) => c.id === product.categoryId)?.name || 'Không rõ';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white p-4">
        <DialogHeader>
          <DialogTitle>Chi tiết món</DialogTitle>
        </DialogHeader>

        {/* Layout ngang: ảnh trái - thông tin + size phải */}
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {/* Ảnh bên trái */}
          <div className="flex-shrink-0">
            <img src={`/${product.imagePath}`} alt={product.name} className="w-60 h-60 object-cover rounded-md" />
          </div>

          {/* Thông tin + size bên phải */}
          <div className="flex-1 space-y-3 text-sm">
            <div>
              <p>
                <strong>ID:</strong> {product.id}
              </p>
              <p>
                <strong>Tên:</strong> {product.name}
              </p>
              <p>
                <strong>Đơn vị:</strong> {product.unit}
              </p>
              <p>
                <strong>Loại hàng:</strong> {categoryName}
              </p>
            </div>
            {/* Size nằm cuối cột phải */}
            <div>
              <p className="font-semibold mb-1">Danh sách size:</p>
              <ul className="space-y-1 list-disc pl-5">
                {product.sizes.map((size) => (
                  <li key={size.size}>
                    {size.size}: {size.price.toLocaleString()}đ
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
