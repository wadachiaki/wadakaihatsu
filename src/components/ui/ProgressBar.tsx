// src/components/ui/ProgressBar.tsx
'use client';
import { useEffect, useState } from 'react';

export default function ProgressBar({
  duration = 10000,
  onFinish,
  label = 'Almost there... stitching pixels with care 🧵🪡',
  barStyle,
}: {
  duration?: number;
  onFinish?: () => void;
  label?: string;
  barStyle?: React.CSSProperties;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);
      if (percent >= 100) {
        clearInterval(interval);
        onFinish?.();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [duration, onFinish]);

  const mergedStyle: React.CSSProperties = {
    backgroundColor: '#2b180e', // ← デフォルト色
    ...barStyle, // ← 上書き優先
    width: `${progress}%`,
  };

  return (
    <div className="w-full max-w-md mx-auto mt-2">
      <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
        <div
          className="h-full transition-all duration-100"
          style={mergedStyle}
        ></div>
      </div>
      {label && (
        <p className="text-sm text-gray-500 mt-2 text-center">{label}</p>
      )}
    </div>
  );
}

/*
使い方
import ProgressBar from '@/components/ui/ProgressBar';
<ProgressBar
label="Almost there... stitching pixels with care 🧵🪡"
barStyle={{ backgroundColor: {指定したい色}} }}
/>

進行時間を変えたい → duration を指定：
<ProgressBar duration={10000} />

ラベルを変えたい：
<ProgressBar label="Sending your design to the print elves... 🧚‍♂️🖨️" />

ラベルを非表示にしたい：
<ProgressBar label="" />

影など
barStyle={{
  backgroundColor: colors[0],
  borderRadius: '4px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
}}

*/