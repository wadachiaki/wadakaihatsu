// src/components/HeaderSwicher.jsx
'use client';

import { usePathname } from 'next/navigation';
import MainHeader from './MainHeader';
import LabHeader from './LabHeader';

export default function HeaderSwicher({ onOpenMenu }) {
  const pathname = usePathname();
  const isLab = pathname.startsWith('/lab');

if (isLab) return <LabHeader onOpenMenu={onOpenMenu} />;

  return <MainHeader onOpenMenu={onOpenMenu} />;
}
