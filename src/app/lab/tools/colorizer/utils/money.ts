// src/app/lab/tools/colorizer/utils/money.ts

export const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});