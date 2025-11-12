// src/app/api/png/route.ts
// このルートをビルド時にプリレンダーせず、Node.js ランタイムでのみ動的実行する
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// ネイティブバインディングを動的にロード
let createCanvas: typeof import('@napi-rs/canvas').createCanvas
let loadImage: typeof import('@napi-rs/canvas').loadImage

if (typeof require !== 'undefined') {
  // 実行時にのみ require するので、Webpack バンドルに含まれない
  // @ts-ignore
  const canvas = require('@napi-rs/canvas')
  createCanvas = canvas.createCanvas
  loadImage = canvas.loadImage
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // 色の受取
  const colorsRaw = searchParams.get('colors');
  if (!colorsRaw) {
    return new NextResponse('Missing colors parameter', { status: 400 });
  }

  let colors: string[];
  try {
    colors = JSON.parse(colorsRaw);
  } catch (e) {
    return new NextResponse('Invalid colors parameter', { status: 400 });
  }

  // SVGテンプレートを選んで読み込み
  const template = searchParams.get('name') || 'oishii-t-front';
  const filePath = path.join(process.cwd(), 'public/tools/colorizer', `${template}.svg`);
  if (!fs.existsSync(filePath)) {
    return new NextResponse('Template not found', { status: 404 });
  }

  let svg = fs.readFileSync(filePath, 'utf-8');
  colors.forEach((c, i) => {
    svg = svg.replaceAll(`{{color${i}}}`, c);
  });

  const width = 3600;
  const height = 4800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const img = await loadImage(Buffer.from(svg));

  const scale = Math.min(width / img.width, height / img.height);
  const x = (width - img.width * scale) / 2;
  const y = (height - img.height * scale) / 2;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

  const pngBuffer = canvas.toBuffer('image/png');
  return new NextResponse(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
