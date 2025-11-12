// src/app/lab/tools/colorizer/components/ColorSizeSelect.tsx

'use client';

import { useEffect, useState } from 'react';

type Variant = {
  id: number;
  size: string;
  color: string;
  price: string;
  retail_price: string;
};

export default function ColorSizeSelect({
  value,
  onChange,
  className = '',
  onRetailPriceChange,
}: {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  onRetailPriceChange?: (retailPrice: string) => void;
}) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    const fetchVariants = async () => {
      const res = await fetch('/api/printful/variants?productId=438'); // 使用する商品を指定
      const ALLOWED_COLORS = ['White'];  // 使用するTシャツの色を指定
      const data = await res.json();
      console.log('🟡 APIレスポンス', data);
      console.log('🟡 バリアント一覧', data.result?.variants);

      const rawVariants = data.result?.variants || [];

      if (rawVariants.length === 0) {
        console.warn('variant が空です');
        return;
      }

      const enriched: Variant[] = rawVariants
        .filter((v: any) => ALLOWED_COLORS.includes(v.color?.color_name))
        .map((v: any) => {
          const price = parseFloat(v.price);
          return {
            id: v.id,
            size: v.size,
            color: v.color?.color_name || 'Unknown',
            price: v.price,
            retail_price: (price * 1.2).toFixed(2),
          };
        });


      setVariants(enriched);
      setSelectedColor(enriched[0].color); // ← 初期選択を必ず設定
    };

    fetchVariants();
  }, []);


  const colors = Array.from(new Set(variants.map((v) => v.color)));

  const filtered = variants.filter((v) => v.color === selectedColor);

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
    const selected = filtered.find((v) => v.id === Number(e.target.value));
    if (selected && onRetailPriceChange) {
      onRetailPriceChange(selected.retail_price);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 色選択 */}
      <select
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="p-2 border rounded w-full"
      >
        {colors.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* サイズ選択 */}
      <select
        name="variantId"
        value={value}
        onChange={handleSizeChange}
        className="p-2 border rounded w-full"
      >
        <option value="">サイズを選択</option>
        {filtered.map((v) => (
          <option key={v.id} value={v.id}>
            {v.size} - ${v.retail_price}
          </option>
        ))}
      </select>
    </div>
  );
}
