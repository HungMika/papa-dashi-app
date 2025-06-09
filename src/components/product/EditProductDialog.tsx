'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category';
import { updateProduct } from '@/services/products';
import { uploadImage } from '@/services/upload';
import { Product } from '@/data/types';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onUpdated?: () => void;
}

export default function EditProductDialog({ open, onOpenChange, product, onUpdated }: Props) {
  const queryClient = useQueryClient();

  const [name, setName] = useState(product.name);
  const [unit, setUnit] = useState(product.unit);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState<Record<string, { enabled: boolean; price: number; quantity: number }>>({
    S: { enabled: false, price: 0, quantity: 0 },
    M: { enabled: false, price: 0, quantity: 0 },
    L: { enabled: false, price: 0, quantity: 0 },
    CS: { enabled: false, price: 0, quantity: 0 },
  });

  const categoryQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  useEffect(() => {
    const sizeMap: typeof sizes = {
      S: { enabled: false, price: 0, quantity: 0 },
      M: { enabled: false, price: 0, quantity: 0 },
      L: { enabled: false, price: 0, quantity: 0 },
      CS: { enabled: false, price: 0, quantity: 0 },
    };
    for (const sz of product.sizes) {
      sizeMap[sz.size] = {
        enabled: true,
        price: sz.price,
        quantity: sz.quantity,
      };
    }
    setSizes(sizeMap);
  }, [product]);

  const mutation = useMutation({
    mutationFn: async () => {
      const sizeList = Object.entries(sizes)
        .filter(([_, val]) => val.enabled)
        .map(([size, val]) => ({
          size,
          price: val.price,
          quantity: val.quantity,
        }));

      let imagePath = product.imagePath;

      if (imageFile) {
        // Tên ảnh cũ vẫn giữ nguyên để ghi đè
        imagePath = await uploadImage(imageFile);
      }

      await updateProduct(product.id, {
        ...product,
        name,
        unit,
        categoryId,
        imagePath,
        sizes: sizeList,
      });
    },
    onSuccess: () => {
      toast.success('Đã cập nhật món');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onOpenChange(false);
      onUpdated?.();
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Cập nhật thất bại');
    },
  });

  const handleSizeChange = (size: string, field: 'price' | 'quantity', value: number) => {
    setSizes((prev) => ({
      ...prev,
      [size]: {
        ...prev[size],
        [field]: value,
      },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa món</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên món" />
          <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Đơn vị (vd: ly, chai...)" />
          <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />

          <div>
            <label className="block text-sm font-medium mb-1">Loại hàng</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại hàng" />
              </SelectTrigger>
              <SelectContent>
                {categoryQuery.data?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kích cỡ & Giá</label>
            {['S', 'M', 'L', 'CS'].map((size) => (
              <div key={size} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={sizes[size].enabled}
                  onChange={(e) =>
                    setSizes((prev) => ({
                      ...prev,
                      [size]: {
                        ...prev[size],
                        enabled: e.target.checked,
                      },
                    }))
                  }
                />
                <span className="w-6">{size}</span>
                <Input
                  type="number"
                  min={0}
                  placeholder="Giá"
                  value={sizes[size].price}
                  disabled={!sizes[size].enabled}
                  onChange={(e) => handleSizeChange(size, 'price', +e.target.value)}
                  className="w-24"
                />
                <Input
                  type="number"
                  min={0}
                  placeholder="SL"
                  value={sizes[size].quantity}
                  disabled={!sizes[size].enabled}
                  onChange={(e) => handleSizeChange(size, 'quantity', +e.target.value)}
                  className="w-20"
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={() => mutation.mutate()} disabled={!name || !categoryId}>
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
