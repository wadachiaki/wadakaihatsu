// src/app/lab/tools/colorizer/SaveButton.tsx

'use client';
import React, { useState } from 'react';
import { exportSvgContainerToPng } from './utils/exportToPng';
import ProgressBar from '@/components/ui/ProgressBar';
import OrderForm from './OrderForm';

export default function SaveButton({
  colors,
}: {
  colors: string[];
}) {
  const [loading, setLoading] = useState(false);
  const [mockupFrontUrl, setMockupFrontUrl] = useState<string | null>(null);
  const [mockupBackUrl, setMockupBackUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [printImageFrontUrl, setPrintImageFrontUrl] = useState<string | null>(null);
  const [printImageBackUrl, setPrintImageBackUrl] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    setMockupFrontUrl(null);
    setMockupBackUrl(null);

    try {
      // 画像生成
      const frontUrl = await exportSvgContainerToPng(colors, 'oishii-t-front');
      const backUrl = await exportSvgContainerToPng(colors, 'illustration01');

      setPrintImageFrontUrl(frontUrl);
      setPrintImageBackUrl(backUrl);

      const res = await fetch("/api/printful/mockup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: [
            {
              type: 'front',
              image_url: frontUrl,
              position: {
                area_width: 1800,
                area_height: 2400,
                width: 1800,
                height: 2400,
                top: 0,
                left: 0,
              },
            },
            {
              type: 'back',
              image_url: backUrl,
              position: {
                area_width: 1800,
                area_height: 2400,
                width: 1800,
                height: 2400,
                top: 0,
                left: 0,
              },
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.mockups) {
        setMockupFrontUrl(data.mockups.front);
        setMockupBackUrl(data.mockups.back);
      } else {
        throw new Error(data.error || "モックアップ生成失敗");
      }
    } catch (err: any) {
      setError(err.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-6 py-3 bg-white dark:bg-[#fffaf8]/10 border rounded m-6"
      >
        {loading ? '生成中…' : 'Tシャツでプレビュー'}
      </button>
      {loading && <ProgressBar
        label="Almost there... stitching pixels with care 🧵🪡"
        barStyle={{ backgroundColor: colors[0] }}
      />}

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <div className="flex flex-col items-center gap-4 mt-4">
        {mockupFrontUrl && (
          <div>
            <p className="font-semibold">Front</p>
            <img src={mockupFrontUrl} alt="Front Mockup" className="max-w-full" />
          </div>
        )}
        {mockupBackUrl && (
          <div>
            <p className="font-semibold">Back</p>
            <img src={mockupBackUrl} alt="Back Mockup" className="max-w-full" />
          </div>
        )}

        {mockupFrontUrl && (
          <OrderForm
            frontImageUrl={printImageFrontUrl!}
            backImageUrl={printImageBackUrl || undefined}
          />
        )}
      </div>
    </div>
  );
}
