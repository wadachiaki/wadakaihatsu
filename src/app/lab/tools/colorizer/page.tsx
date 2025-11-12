// src/app/lab/tools/colorizer/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ColorPicker from './ColorPicker';
import SvgDisplay from './SvgDisplay';
import SaveButton from './SaveButton';

export default function Page() {
  const [colors, setColors] = useState([
    '#ff0101', // 初期値：赤
    '#0133ff', // 青
    '#cccbcb', // グレー
    '#1f0a00', // 黒
  ]);
  const bgColor = '#ffffff';

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">SVG Colorizer</h1>
      <ColorPicker colors={colors} setColors={setColors} />

      <div id="svg-container">
  {/* 実際に表示する方（背面） */}
  <SvgDisplay colors={colors} bgColor={bgColor} id="illustration01" />

  {/* 表示しないがPNG出力する用（前面） */}
  <div style={{ display: 'none' }}>
    <SvgDisplay colors={colors} bgColor={bgColor} id="oishii-t-front" />
  </div>
</div>

      <SaveButton colors={colors} />

    </div>
  );
}