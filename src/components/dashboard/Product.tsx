'use client';

import { useState } from 'react';
import { Product } from '@/data/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArchiveX } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import { useConfirm } from '@/hooks/use-confirm';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]?.size || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSoldOut, setIsSoldOut] = useState<boolean>(false);

  const { addItem } = useOrder();

  // 2 bộ confirm: 1 cho hết hàng, 1 cho có hàng
  const [SoldOutDialog, confirmSoldOut] = useConfirm(
    'Xác nhận hết hàng',
    `Bạn có chắc món "${product.name}" đã hết hàng?`,
  );
  const [RestockDialog, confirmRestock] = useConfirm(
    'Xác nhận có hàng lại',
    `Bạn có chắc món "${product.name}" đã có hàng lại?`,
  );

  const selectedOption = product.sizes.find((s) => s.size === selectedSize);
  const price = selectedOption ? selectedOption.price : 0;

  const handleOrder = () => {
    if (!selectedOption || isSoldOut) return;
    addItem({
      productId: product.id,
      name: product.name,
      size: selectedOption,
      quantity,
    });
    setQuantity(1);
  };

  const handleToggleSoldOut = async () => {
    const ok = isSoldOut ? await confirmRestock() : await confirmSoldOut();
    if (ok) setIsSoldOut(!isSoldOut);
  };

  return (
    <>
      <Card className="w-full max-w-xs shadow-sm">
        <CardHeader className="px-3">
          <CardTitle className="text-[13px]">{product.name}</CardTitle>
        </CardHeader>

        <CardContent className="px-2 flex flex-col gap-2 relative">
          {/* Ảnh món */}
          <div className="w-full h-30 bg-gray-100 rounded overflow-hidden relative">
            <img src={product.imagePath} alt={product.name} className="w-full h-full object-cover" />
            {isSoldOut && (
              <div className="absolute inset-0 bg-white opacity-70 flex items-center justify-center">
                <span className="text-red-600 text-md font-bold">HẾT HÀNG</span>
              </div>
            )}
          </div>

          {/* Size */}
          <div>
            <h4 className="font-medium text-[12px] mb-1">Size</h4>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
              {product.sizes.map((option) => (
                <div key={option.size} className="flex items-center space-x-1">
                  <RadioGroupItem value={option.size} id={option.size} className="cursor-pointer" />
                  <label htmlFor={option.size} className="text-[12px]">
                    {option.size}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Số lượng */}
          <div className="flex justify-end items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 cursor-pointer"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={isSoldOut}
            >
              -
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-10 h-6 text-center text-[12px] p-0"
              disabled={isSoldOut}
            />
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 cursor-pointer"
              onClick={() => setQuantity((q) => q + 1)}
              disabled={isSoldOut}
            >
              +
            </Button>
          </div>

          {/* Giá và nút hành động */}
          <div className="flex flex-col md:flex-row md:justify-between gap-2 items-start md:items-center">
            <div className="text-sm font-semibold">{price.toLocaleString()} VND</div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
              <Button size="sm" className="cursor-pointer w-full sm:w-auto" onClick={handleOrder} disabled={isSoldOut}>
                Order
              </Button>
              <Button
                size="sm"
                className={`p-1 w-full sm:w-auto ${isSoldOut ? 'bg-red-600' : 'bg-blue-600'} text-white cursor-pointer`}
                onClick={handleToggleSoldOut}
              >
                <ArchiveX className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog xác nhận */}
      <SoldOutDialog />
      <RestockDialog />
    </>
  );
}
