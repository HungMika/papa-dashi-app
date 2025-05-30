import { useState } from 'react';
import { Product } from '@/data/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]?.size || '');
  const [quantity, setQuantity] = useState<number>(1);

  const selectedOption = product.sizes.find((s) => s.size === selectedSize);
  const price = selectedOption ? selectedOption.price : 0;

  const handleOrder = () => {
    alert(`Ordered ${quantity} x ${product.name} (${selectedSize})`);
  };

  return (
    <Card className="w-full max-w-xs shadow-sm">
      <CardHeader className="px-3">
        <CardTitle className="text-[13px]">{product.name}</CardTitle>
      </CardHeader>

      <CardContent className="px-2 flex flex-col gap-2">
        <div className="w-full h-28 bg-gray-100 rounded overflow-hidden">
          <img src={product.imagePath} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <h4 className="font-medium text-[12px] mb-1">Size</h4>
          <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
            {product.sizes.map((option) => (
              <div key={option.size} className="flex items-center space-x-1">
                <RadioGroupItem value={option.size} id={option.size} />
                <label htmlFor={option.size} className="text-[12px]">
                  {option.size}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Dãy chọn số lượng dời sang phải */}
        <div className="flex justify-end items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-10 h-6 text-center text-[12px] p-0"
          />
          <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => setQuantity((q) => q + 1)}>
            +
          </Button>
        </div>

        <div className="text-sm font-semibold">{price} VND</div>
        <Button size="sm" onClick={handleOrder}>
          Order
        </Button>
      </CardContent>
    </Card>
  );
}
