// src/app/lab/tools/colorizer/components/PrefectureSelect.tsx

'use client';
import React from 'react';

const PREFECTURES_JP = [
  'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima',
  'Ibaraki', 'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
  'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano',
  'Gifu', 'Shizuoka', 'Aichi', 'Mie',
  'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara', 'Wakayama',
  'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi',
  'Tokushima', 'Kagawa', 'Ehime', 'Kochi',
  'Fukuoka', 'Saga', 'Nagasaki', 'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa',
];

const STATES_US = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana',
  'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
  'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
  'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export default function PrefectureSelect({
  countryCode,
  value,
  onChange,
  name = 'state',
  className = '',
}: {
  countryCode: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  name?: string;
  className?: string;
}) {
  const getRegionList = () => {
    if (countryCode === 'JP') return PREFECTURES_JP;
    if (countryCode === 'US') return STATES_US;
    return [];
  };

  const regionList = getRegionList();

  if (regionList.length === 0) {
    return (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="State / Province"
        className={`p-2 border rounded ${className}`}
      />
    );
  }

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`p-2 border rounded ${className}`}
    >
      <option value="">Select {countryCode === 'JP' ? 'Prefecture' : 'State'}</option>
      {regionList.map((r) => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>
  );
}
