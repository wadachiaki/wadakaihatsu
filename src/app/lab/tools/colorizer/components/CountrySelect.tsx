'use client';
import React from 'react';

const COUNTRIES = [
  { code: 'JP', name: 'Japan' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AU', name: 'Australia' },
  { code: 'CN', name: 'China' },
  { code: 'KR', name: 'South Korea' },
  { code: 'IN', name: 'India' },
  { code: 'TH', name: 'Thailand' },
  // 必要に応じてもっと追加
];

export default function CountrySelect({
  value,
  onChange,
  name = 'country_code',
  className = '',
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  className?: string;
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`p-2 border rounded ${className}`}
    >
      <option value="">Select Country</option>
      {COUNTRIES.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
}
