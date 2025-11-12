// src/app/lab/tools/myakugaki/MyakugakiClient.tsx
'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const CanvasArea = dynamic(() => import('./CanvasArea'), { ssr: false });

export default function MyakugakiPage() {
  const canvasRef = useRef<{ clearAllGroups: () => void; exportCanvasPNG: () => void }>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [baseRadius, setBaseRadius] = useState(20);

  const handleReset = () => {
    canvasRef.current?.clearAllGroups();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleExport = () => {
    canvasRef.current?.exportCanvasPNG();
  };

  return (

    <div className="relative z-10 min-h-screen flex flex-col items-center justify-start">
      <div>
        <div className="fixed top-0 left-0 w-full z-1 pointer-events-none overflow-hidden">
          <img
            src="/tools/colorizer/myakugaki/mkgk_bg1.svg"
            alt="背景"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="fixed top-0 left-0 w-full z-0 pointer-events-none overflow-hidden">
          <img
            src="/tools/colorizer/myakugaki/mkgk_bg2.svg"
            alt="背景"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="text-center z-2 mt-4 mb-4">
        {/* タイトル */}
        <header className="text-center mt-4 mb-4">
          <h1 className="text-3xl font-bold">myakugaki</h1>
        </header>

        <div className="flex-1 w-full flex flex-col items-center justify-start">

          {/* 写真表示エリア */}
          <CanvasArea ref={canvasRef} imageFile={imageFile} baseRadius={baseRadius} />

          {/* スライダー */}
          <div className="flex justify-center items-center gap-2 mb-6">
            {/* 左のダミースペース */}
            <div className="w-10" aria-hidden="true" />

            {/* スライダー */}
            <input
              id="radiusSlider"
              type="range"
              min="5"
              max="40"
              step="1"
              value={baseRadius}
              onChange={(e) => setBaseRadius(parseInt(e.target.value))}
              className="w-40 accent-[#E60012]"
            />

            {/* 右の数値表示 */}
            <div className="w-10 text-xs tabular-nums">
              {baseRadius}px
            </div>
          </div>

          {/* ボタンコーナー */}
          <div className="flex gap-2">
            <input type="file" id="imageLoader" accept="image/*" className="hidden" onChange={handleImageChange} />

            <label htmlFor="imageLoader" className="inline-flex items-center justify-center w-9 h-9 bg-white rounded-md hover:bg-gray-200 transition-colors" title="写真をアップロード">
              <svg
                viewBox="0 0 176 136"
                xmlns="http://www.w3.org/2000/svg"
                className="block w-5 h-5 text-red-500"
                aria-hidden="true"
              >
                <rect
                  x="8" y="8" width="160" height="120" fill="none"
                  stroke="currentColor"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="88" cy="68"
                  r="28.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

            </label>

            <button id="resetBtn" onClick={handleReset} title="リセット" className="inline-flex items-center justify-center w-9 h-9 bg-white rounded-md hover:bg-gray-200 transition-colors">
              <svg
                viewBox="0 0 154 127"
                xmlns="http://www.w3.org/2000/svg"
                className="block w-5 h-5 text-red-500"
                aria-hidden="true"
              >
                <path
                  d="M127.17 10.93 L118.00 51.57 L77.33 41.74"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M114.87 81.54
                    C107.44 105.74 86.93 118.20 63.00 118.20
                    C32.64 118.20 8.00 93.55 8.00 63.20
                    C8.00 32.84 32.64 8.20 63.00 8.20
                    C89.37 8.20 112.66 26.79 118.00 51.58"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button id="exportBtn" onClick={handleExport} title="保存する" className="inline-flex items-center justify-center w-9 h-9 bg-white rounded-md hover:bg-gray-200 transition-colors">
              <svg
                viewBox="0 0 136 136"
                xmlns="http://www.w3.org/2000/svg"
                className="block w-5 h-5 text-red-500"
                aria-hidden="true"
              >
                <path
                  d="M68 98 L68 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 128 L128 128"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M108 58 L68 98 L28 58"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

            </button>
          </div>

        </div>

        {/* 注意書き */}
        <footer className="bottom-0 z-1 mt-4 text-[0.2rem] text-center">
          <p>
            本ツールは個人開発による非公式の作品です。キャラクター利用時は
            <a
              href="https://www.expo2025.or.jp/wp/wp-content/themes/expo2025orjp_2022/assets/pdf/character/character_terms.pdf"
              target="_blank"
              rel="noopener"
              className="text-red-600 hover:underline">
              公式ガイドライン</a>
            をご確認ください。
            Created by
            <a href="https://twitter.com/tom_oishiina"
              target="_blank"
              rel="noopener"
              className="text-red-600 hover:underline">
              tom_oishiina</a>
          </p>
        </footer>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-0 pointer-events-none overflow-hidden">
        <img
          src="/tools/colorizer/myakugaki/mkgk_bg3.svg"
          alt="下部背景"
          className="w-full h-full object-cover"
        />
      </div>

    </div>

  );
}
