// src/app/tools/colorizer/ColorPicker.tsx
import React from 'react';

export default function ColorPicker({
  colors,
  setColors
}: {
  colors: string[];
  setColors: (newColors: string[]) => void;
}) {
  const handleColorChange = (index: number, value: string) => {
    const updated = [...colors];
    updated[index] = value;
    setColors(updated);
  };

  return (
    <div className="flex gap-4 mb-4">
      {colors.map((color, idx) => (
        <input
          key={idx}
          type="color"
          value={color}
          onChange={(e) => handleColorChange(idx, e.target.value)}
        />
      ))}
    </div>
  );
}