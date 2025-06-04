'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addProduct } from '@/services/products';
import { categoryService } from '@/services/category';
import toast from 'react-hot-toast';
import { uploadImage } from '@/services/upload';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export default function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState<Record<string, { enabled: boolean; price: number; quantity: number }>>({
    S: { enabled: false, price: 0, quantity: 0 },
    M: { enabled: false, price: 0, quantity: 0 },
    L: { enabled: false, price: 0, quantity: 0 },
    CS: { enabled: false, price: 0, quantity: 0 },
  });

  const queryClient = useQueryClient();

  const categoryQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!imageFile) throw new Error('Chưa chọn ảnh sản phẩm');

      // Tạo đường dẫn lưu ảnh (đặt tên file theo id)
      const imagePath = await uploadImage(imageFile);

      // Lọc size đã chọn
      const sizeList = Object.entries(sizes)
        .filter(([_, val]) => val.enabled)
        .map(([size, val]) => ({
          size,
          price: val.price,
          quantity: val.quantity,
        }));

      // Gọi API tạo món
      await addProduct({
        id,
        name,
        unit,
        imagePath,
        categoryId,
        sizes: sizeList,
      });
    },
    onSuccess: () => {
      toast.success('Đã thêm món mới');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setOpen(false);
      setId('');
      setName('');
      setUnit('');
      setCategoryId('');
      setImageFile(null);
      setSizes({
        S: { enabled: false, price: 0, quantity: 0 },
        M: { enabled: false, price: 0, quantity: 0 },
        L: { enabled: false, price: 0, quantity: 0 },
        CS: { enabled: false, price: 0, quantity: 0 },
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Thêm món thất bại');
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2 w-full cursor-pointer">+ Thêm món</Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm món mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Mã món (id)"
            disabled={mutation.isPending}
          />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên món"
            disabled={mutation.isPending}
          />
          <Input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Đơn vị (ví dụ: ly, chai...)"
            disabled={mutation.isPending}
          />
          <Input
            type="file"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            disabled={mutation.isPending}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Loại hàng</label>
            <Select value={categoryId} onValueChange={setCategoryId} disabled={mutation.isPending}>
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
                  placeholder="Giá"
                  value={sizes[size].price}
                  disabled={!sizes[size].enabled || mutation.isPending}
                  onChange={(e) => handleSizeChange(size, 'price', +e.target.value)}
                  className="w-24"
                />
                <Input
                  type="number"
                  placeholder="SL"
                  value={sizes[size].quantity}
                  disabled={!sizes[size].enabled || mutation.isPending}
                  onChange={(e) => handleSizeChange(size, 'quantity', +e.target.value)}
                  className="w-20"
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={mutation.isPending}>
            Hủy
          </Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !id || !name || !categoryId}>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
