//src/app/lab/tools/colorizer/OrderForm.tsx

'use client';
import { useState } from 'react';
import { usdFormatter } from './utils/money';
import PrefectureSelect from './components/PrefectureSelect';
import CountrySelect from './components/CountrySelect';
import ColorSizeSelect from './components/ColorSizeSelect';

export default function OrderForm({
  frontImageUrl,
  backImageUrl,
}: {
  frontImageUrl: string;
  backImageUrl?: string;
}) {
  const [form, setForm] = useState({
    name: '',
    address1: '',
    city: '',
    state: '',
    zip: '',
    country_code: 'JP',
    phone: '',
    email: '',
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [variantId, setVariantId] = useState<number>(11577);
  const [retailPrice, setRetailPrice] = useState<string>(''); // 💰 retail_price を保持
  const totalPrice = Number(retailPrice) * form.quantity;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'variantId') {
      setVariantId(Number(value));
    } else if (name === 'quantity') {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      recipient: {
        name: form.name,
        address1: form.address1,
        city: form.city,
        state: form.state,
        zip: form.zip,
        country_code: form.country_code,
        phone: form.phone,
        email: form.email,
      },
      items: [
        {
          variant_id: variantId,
          quantity: Number(form.quantity),
          retail_price: retailPrice,
          files: [
            ...(frontImageUrl ? [{
              type: 'front',
              url: frontImageUrl,
            }] : []),
            ...(backImageUrl ? [{
              type: 'back',
              url: backImageUrl,
            }] : []),
          ],
        },
      ],
      shipping: 'STANDARD',
      confirm: false,
    };

    console.log('[Printful APIに送るデータ（詳細）]', JSON.stringify(payload, null, 2));
    console.table(payload.items[0].files);

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setOrderId(data.id);
      } else {
        setError(data.error || '注文送信失敗');
      }
    } catch (err: any) {
      setError(err.message || '送信エラー');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-6 space-y-3 border-t pt-6 text-left">
      <h2 className="text-lg font-semibold">Order Form</h2>
      <div className="grid gap-2">
        {['name', 'address1', 'city', 'zip', 'phone', 'email'].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            onChange={handleChange}
            value={(form as any)[field]}
            className="p-2 border rounded"
          />
        ))}

        {/* 都道府県は PrefectureSelect に分離！ */}
        <PrefectureSelect
          countryCode={form.country_code}
          value={form.state}
          onChange={handleChange}
          className="w-full"
        />

        <CountrySelect
          value={form.country_code}
          onChange={handleChange}
          className="w-full"
        />

        <ColorSizeSelect
          value={variantId}
          onChange={handleChange}
          onRetailPriceChange={(price) => setRetailPrice(price)}
          className="w-full"
        />


        <input
          name="quantity"
          type="number"
          min={1}
          value={form.quantity}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="数量"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        {loading ? '注文を作成中...' : 'Make Order🛒💨'}
      </button>

      {error && <p className="text-red-600">{error}</p>}
      {result && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-sm space-y-2">
          <p className="font-bold">🎉 注文下書き作成成功！</p>
          <p>注文ID: {orderId}</p>
          <p>商品代: {usdFormatter.format(Number(retailPrice))} × {form.quantity} = <strong>{usdFormatter.format(totalPrice)}</strong></p>
          <p>送料: {usdFormatter.format(result.costs?.shipping)}</p>
          <p className="font-bold">合計: {usdFormatter.format(totalPrice + Number(result.costs?.shipping || 0))}</p>

          <button
            className="mt-2 px-3 py-2 bg-blue-600 text-white rounded"
            onClick={() => alert(`注文ID: ${orderId} を使って confirm できます！`)}
          >
            注文確定📦（今回は送信なしでID表示だけ）
          </button>
        </div>
      )}
    </div>
  );
}
