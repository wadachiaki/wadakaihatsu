// src/app/lab/tools/colorizer/utils/debounce.ts
import debounce from 'lodash.debounce';

export function debounceAsync<T extends (...args: any[]) => Promise<void>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  return debounce((...args: Parameters<T>) => {
    func(...args);
  }, wait);
}
