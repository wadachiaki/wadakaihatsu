// src/components/ClientLayout.jsx
'use client';

import React, { useState } from 'react';
import HeaderSwicher from './HeaderSwicher';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <HeaderSwicher onOpenMenu={() => setMenuOpen(true)} />
      <Sidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <main className="mainContent">
        {children}
      </main>
    </>
  );
}
