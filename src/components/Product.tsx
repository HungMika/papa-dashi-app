'use client';

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
    // Hook this up to real order logic later
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-[15px]">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <img src={product.imagePath} alt={product.name} className="w-full h-48 object-cover rounded" />
        <div>
          <h4 className="font-semibold text-[14px]">Select Size</h4>
          <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex gap-4">
            {product.sizes.map((option) => (
              <div key={option.size} className="flex items-center space-x-2">
                <RadioGroupItem value={option.size} id={option.size} />
                <label htmlFor={option.size}>{option.size}</label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            -
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-16 text-center"
          />
          <Button variant="outline" onClick={() => setQuantity((q) => q + 1)}>
            +
          </Button>
        </div>
        <div className="font-semibold text-lg">{price}</div>
        <Button onClick={handleOrder}>Order</Button>
      </CardContent>
    </Card>
  );
}
