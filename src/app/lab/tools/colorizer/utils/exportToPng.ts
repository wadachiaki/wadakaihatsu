// src/app/tools/colorizer/utils/exportToPng.ts
export async function exportSvgContainerToPng(
  colors: string[],
  template: string
): Promise<string | null> {
  const svgRaw = await fetch(`/tools/colorizer/${template}.svg`).then((res) => res.text());

  // 色を差し替える
  let replacedSvg = svgRaw;
  colors.forEach((color, i) => {
    const placeholder = `{{color${i}}}`;
    replacedSvg = replacedSvg.replaceAll(placeholder, color);
  });

  const svgBlob = new Blob([replacedSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.src = url;

  await new Promise((resolve) => (img.onload = resolve));

  // 💡 高解像度設定（30.48 × 40.64 cm at 300dpi）
  const width = 3600;
  const height = 4800;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 📏 比率を維持して中央に描画
  const imgWidth = img.width;
  const imgHeight = img.height;
  const scale = Math.min(width / imgWidth, height / imgHeight);
  const drawWidth = imgWidth * scale;
  const drawHeight = imgHeight * scale;
  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

  // クエリパラメータを組み立て（SVG名と色を指定）
  const query = new URLSearchParams({
    name: template,
    colors: JSON.stringify(colors),
  });

  const pngUrl = `https://lab-oishiiclub.vercel.app/api/png?${query.toString()}`;

  console.log('✅ モックアップ用PNG URL:', pngUrl);

  return pngUrl;
}
