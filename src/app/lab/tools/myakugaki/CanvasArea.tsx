// src/app/lab/tools/myakugaki/CanvasArea.tsx
'use client';

import React, {
  useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle
} from 'react';
import {
  Point, Dot, Eye,
  chaikinSmooth,
  generateDotsAlongPath
} from '@/lib/myakugaki/drawUtils';

/** グループ型 */
type Group = {
  id: string;
  img: HTMLImageElement;
  bbox: { xMin: number; yMin: number; xMax: number; yMax: number };
};

const CanvasArea = forwardRef(function CanvasArea(
  {
    imageFile,
    baseRadius,
  }: {
    imageFile: File | null;
    baseRadius: number;
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [groups, setGroups] = useState<Group[]>([]);

  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [resizingIndex, setResizingIndex] = useState<number | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const clearAllGroups = () => {
    setGroups([]);
  };

  useImperativeHandle(ref, () => ({
    clearAllGroups,
    exportCanvasPNG: () => {
  if (!image || !canvasRef.current) return;

  const origW = image.width;
  const origH = image.height;

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = origW;
  exportCanvas.height = origH;

  const ctx = exportCanvas.getContext('2d');
  if (!ctx) return;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, origW, origH);

  groups.forEach(grp => {
    const x = grp.bbox.xMin / scale;
    const y = grp.bbox.yMin / scale;
    const w = (grp.bbox.xMax - grp.bbox.xMin) / scale;
    const h = (grp.bbox.yMax - grp.bbox.yMin) / scale;
    ctx.drawImage(grp.img, x, y, w, h);
  });

  const url = exportCanvas.toDataURL('image/png');

  if ('ontouchstart' in window) {
    // タッチデバイスの場合はモーダル表示
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';

    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.border = '8px solid white';
    img.style.borderRadius = '8px';

    modal.appendChild(img);

    modal.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    document.body.appendChild(modal);
  } else {
    // PCやマウスデバイスならそのままダウンロード
    const a = document.createElement('a');
    a.href = url;
    a.download = 'myakugaki_export.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

  }));

  const handlePointerStart = (x: number, y: number) => {
    // ① 削除ボタン判定（×）
    for (let i = groups.length - 1; i >= 0; i--) {
      const { xMin, yMin, xMax } = groups[i].bbox;
      const deleteSize = 20;
      const deleteX = xMax - deleteSize;
      const deleteY = yMin - deleteSize;
      if (x >= deleteX && x <= xMax && y >= deleteY && y <= yMin) {
        setGroups(prev => prev.filter(g => g !== groups[i]));
        return;
      }
    }

    // ② リサイズ or 移動判定
    for (let i = groups.length - 1; i >= 0; i--) {
      const { xMin, yMin, xMax, yMax } = groups[i].bbox;
      const handleSize = 16;
      const inResize =
        x >= xMax - handleSize / 2 &&
        x <= xMax + handleSize / 2 &&
        y >= yMax - handleSize / 2 &&
        y <= yMax + handleSize / 2;
      const inDrag = x >= xMin && x <= xMax && y >= yMin && y <= yMax;
      if (inResize) {
        setResizingIndex(i);
        return;
      } else if (inDrag) {
        dragOffset.current = { x: x - xMin, y: y - yMin };
        setGroups(prev => {
          const updated = [...prev];
          const [target] = updated.splice(i, 1);
          updated.push(target);
          return updated;
        });
        setDraggingIndex(groups.length - 1); // 最前面に移動したのでインデックスが末尾になる
        return;
      }
    }

    // ③ 新規描画開始
    setPoints([{ x, y }]);
    setDrawing(true);
  };

useEffect(() => {
  if (!imageFile || !canvasRef.current) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = async () => {
      try {
        await img.decode(); // 画像のデコードを待つ
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // ディスプレイサイズに合わせたスケール計算
        const dpr = window.devicePixelRatio || 1;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        // 画面の90%を上限とする
        const targetW = vw * 0.9;
        const targetH = vh * 0.9;

        let s = Math.min(targetW / img.width, targetH / img.height);
        // スケールが1を超える場合は、原寸大で表示（拡大しない）
        if (s > 1) s = 1;
        setScale(s);

        const displayW = img.width * s;
        const displayH = img.height * s;

        // Canvasの実際の解像度を設定
        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;
        // Canvasの表示サイズをCSSで設定
        canvas.style.width = `${displayW}px`;
        canvas.style.height = `${displayH}px`;

        // 高DPRデバイス対応
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true; // スムージングを有効にする
        ctx.imageSmoothingQuality = 'high'; // スムージング品質を高く設定する

        ctx.clearRect(0, 0, displayW, displayH);
        ctx.drawImage(img, 0, 0, displayW, displayH);

        setImage(img);
      } catch (error) {
        console.error('Image decoding failed:', error);
      }
    };
    img.src = event.target?.result as string;
  };
  reader.readAsDataURL(imageFile);
}, [imageFile]);

  const renderAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const logicalW = canvas.width / dpr;
    const logicalH = canvas.height / dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, logicalW, logicalH);

    groups.forEach((grp, i) => {
      const { xMin, yMin, xMax, yMax } = grp.bbox;
      const w = xMax - xMin;
      const h = yMax - yMin;
      ctx.drawImage(grp.img, xMin, yMin, w, h);

      ctx.save();
      ctx.setLineDash([4, 2]);
      ctx.strokeStyle = 'rgba(201, 137, 137, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(xMin, yMin, w, h);

      const handleSize = 8;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(xMax - handleSize / 2, yMax - handleSize / 2, handleSize, handleSize);
      ctx.restore();

      const deleteSize = 14;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(xMax - deleteSize, yMin - deleteSize, deleteSize, deleteSize);
      ctx.font = '12px sans-serif';
      ctx.fillText('×', xMax - deleteSize + 3, yMin - deleteSize + 11);
    });
  }, [groups, image]);

  useEffect(() => {
    renderAll();
  }, [groups, renderAll]);

  const handleMouseMove = (x: number, y: number) => { // イベントオブジェクトではなく座標を直接受け取るように変更
    if (resizingIndex !== null) {
      setGroups(prev => {
        const updated = [...prev];
        const bbox = updated[resizingIndex].bbox;
        const width = bbox.xMax - bbox.xMin;
        const height = bbox.yMax - bbox.yMin;
        // アスペクト比を保持してリサイズ
        const aspectRatio = width / height;
        let newWidth = x - bbox.xMin;
        let newHeight = newWidth / aspectRatio;

        // 最小サイズを設定（小さすぎると消えてしまうため）
        const minSize = 20;
        if (newWidth < minSize) {
          newWidth = minSize;
          newHeight = minSize / aspectRatio;
        }
        if (newHeight < minSize) {
          newHeight = minSize;
          newWidth = minSize * aspectRatio;
        }


        updated[resizingIndex] = {
          ...updated[resizingIndex],
          bbox: {
            ...bbox,
            xMax: bbox.xMin + newWidth,
            yMax: bbox.yMin + newHeight
          }
        };
        return updated;
      });
      return;
    }

    if (draggingIndex !== null) {
      setGroups(prev => {
        const updated = [...prev];
        const bbox = updated[draggingIndex].bbox;
        const w = bbox.xMax - bbox.xMin;
        const h = bbox.yMax - bbox.yMin;
        updated[draggingIndex] = {
          ...updated[draggingIndex],
          bbox: {
            xMin: x - dragOffset.current.x,
            yMin: y - dragOffset.current.y,
            xMax: x - dragOffset.current.x + w,
            yMax: y - dragOffset.current.y + h
          }
        };
        return updated;
      });
      return;
    }

    if (!drawing) return;
    setPoints(prev => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setDraggingIndex(null);
    setResizingIndex(null);
    if (!canvasRef.current || !image) return;

    // 描画中でない場合、または点が少なすぎる場合は処理しない
    if (points.length < 3) { // drawingの状態に依存しない
      setPoints([]);
      return;
    }

    const smooth = chaikinSmooth(points, 2);
    const { dots, eyes } = generateDotsAlongPath(smooth, baseRadius);

    let xMin = Infinity, yMin = Infinity, xMax = -Infinity, yMax = -Infinity;
    dots.forEach(({ x, y, rx, ry }) => {
      xMin = Math.min(xMin, x - rx);
      yMin = Math.min(yMin, y - ry);
      xMax = Math.max(xMax, x + rx);
      yMax = Math.max(yMax, y + ry);
    });
    const padding = 10;
    xMin -= padding;
    yMin -= padding;
    xMax += padding;
    yMax += padding;

    const width = xMax - xMin;
    const height = yMax - yMin;
    const dpr = window.devicePixelRatio || 1;

    // オフスクリーンキャンバスで描画
    const off = document.createElement('canvas');
    off.width = width * dpr;
    off.height = height * dpr;
    const offCtx = off.getContext('2d')!;
    offCtx.scale(dpr, dpr);
    offCtx.imageSmoothingEnabled = true;
    offCtx.imageSmoothingQuality = 'high';

    dots.forEach(d => {
      offCtx.beginPath();
      offCtx.ellipse(d.x - xMin, d.y - yMin, d.rx, d.ry, 0, 0, 2 * Math.PI);
      offCtx.fillStyle = '#E60012';
      offCtx.fill();
    });
    eyes.forEach(e => {
      const d = dots[e.dotIndex];
      const cx = d.x - xMin;
      const cy = d.y - yMin;
      const r = ((d.rx + d.ry) / 2) * 0.5;
      offCtx.beginPath();
      offCtx.ellipse(cx, cy, r, r, 0, 0, 2 * Math.PI);
      offCtx.fillStyle = '#fff';
      offCtx.fill();
      offCtx.beginPath();
      offCtx.ellipse(cx + e.offsetX, cy + e.offsetY, r * 0.5, r * 0.5, 0, 0, 2 * Math.PI);
      offCtx.fillStyle = '#0E4AFF';
      offCtx.fill();
    });

    const img = new Image();
    img.onload = () => {
      setGroups(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          img,
          bbox: { xMin, yMin, xMax, yMax }
        }
      ]);
    };
    img.src = off.toDataURL('image/png');

    setPoints([]);
  };

  return (
    <div className="w-full flex justify-center">
      <div
        ref={containerRef}
        className="relative z-[1] inline-block border-2 border-gray-300 bg-white touch-none mb-4"
      >
        <canvas
          id="mainCanvas"
          ref={canvasRef}
          className="block"
          /* マウス操作 */
          onMouseDown={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            handlePointerStart(e.clientX - rect.left, e.clientY - rect.top);
          }}
          onMouseMove={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            handleMouseMove(e.clientX - rect.left, e.clientY - rect.top);
          }}
          onMouseUp={handleMouseUp}

          /* タッチ操作 */
          onTouchStart={e => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            handlePointerStart(
              touch.clientX - rect.left,
              touch.clientY - rect.top
            );
          }}
          onTouchMove={e => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            // handleMouseMove に座標を渡すように変更
            handleMouseMove(x, y);
          }}
          onTouchEnd={e => {
            e.preventDefault();
            handleMouseUp();
          }}
        />
      </div>
    </div>
  );
});

export default CanvasArea;
