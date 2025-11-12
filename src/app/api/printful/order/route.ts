import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { recipient, items, shipping = 'STANDARD', confirm = false } = body;

  const token = process.env.PRINTFUL_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'APIトークンが未設定です' }, { status: 500 });
  }

  const orderData = {
    recipient,
    items, // ← ここでfilesを含めて渡す！
    shipping,
    confirm,
  };

  try {
    const res = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data.result);
    } else {
      return NextResponse.json({ error: data.result || '注文作成に失敗しました' }, { status: res.status });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'エラーが発生しました' }, { status: 500 });
  }
}
