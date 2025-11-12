// src/app/api/printful/mockup/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
const { files } = await req.json();
console.log('✅ 受け取ったパラメータ:', { files });

if (!files || !Array.isArray(files) || files.length === 0) {
  return NextResponse.json({ error: "files is missing or invalid" }, { status: 400 });
}


  const token = process.env.PRINTFUL_API_TOKEN!;
  const productId = 438; //Unisex Classic Tee | Gildan 5000
  const variantId = 11577; //white Msize

  const taskRes = await fetch(`https://api.printful.com/mockup-generator/create-task/${productId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      variant_ids: [variantId],
      format: "png",
      files ,
    }),
  });

  const taskJson = await taskRes.json();
  console.log('taskJson:', taskJson);

  const taskKey = taskJson.result?.task_key;
  if (!taskKey) {
    return NextResponse.json({ error: "task_key 取得失敗", detail: taskJson }, { status: 500 });
  }

  const pollIntervals = [8000, 2000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]; // 合計：17秒

for (let i = 0; i < pollIntervals.length; i++) {
    await new Promise((r) => setTimeout(r, pollIntervals[i]));
    const pollRes = await fetch(`https://api.printful.com/mockup-generator/task?task_key=${taskKey}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const pollData = await pollRes.json();
    console.log(`⏳ ポーリング${i + 1}回目:`, pollData);

    if (pollData.result?.status === "completed") {
      const mockups = pollData.result.mockups;
      const allExtra = mockups.flatMap((m: any) => m.extra || []);

      // フロントとバックの Flat画像をそれぞれ探す
      const frontImage =
        allExtra.find((e: any) => e.title === "Front" && e.option_group === "Flat") ||
        allExtra.find((e: any) => e.title === "Front");

      const backImage =
        allExtra.find((e: any) => e.title === "Back" && e.option_group === "Flat") ||
        allExtra.find((e: any) => e.title === "Back");

      const result: Record<string, string | null> = {
        front: frontImage?.url || null,
        back: backImage?.url || null,
      };

      console.log("🎯 モックアップURL（両面）:", result);

      return NextResponse.json({ mockups: result });
    }
  }

  return NextResponse.json({ error: "Sorry...Try again🥹" }, { status: 504 });
}
