// /app/api/printful/variants/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = process.env.PRINTFUL_API_TOKEN!;
  const productId = req.nextUrl.searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  const res = await fetch(`https://api.printful.com/catalog/variants?product_id=${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
