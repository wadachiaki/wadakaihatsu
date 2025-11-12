// src/components/LabHeader.jsx

'use client';
import { useEffect } from 'react';

export default function HeaderWithState({ onOpenMenu }) {

  useEffect(() => {
    const title = document.querySelector('.mainTitleLink');
    const handleScroll = () => {
      if (!title) return;
      if (window.scrollY > 50) {
        title.classList.add('shrink');
      } else {
        title.classList.remove('shrink');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`backdrop-blur bg-[#fffaf8]/70 dark:bg-[#100e0d]/70 shadow-none sticky top-0 z-[1000] transition-all duration-300 `}
    >
      <div className="flex items-center justify-start px-4">
        <button
          onClick={onOpenMenu}
            aria-label="メニューを開く"
            className="text-2xl pr-[clamp(0.1rem,2vw,2rem)] py-2 hover:opacity-70"
          >
            ☰
          </button>
        <div id="mainTitle">
          <a href="/" className="mainTitleLink">
            OISHII CLUB LAB
          </a>
        </div>
      </div>

      {/* サイドバー（オーバーレイ含む） 
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />*/}
    </header>
  );
}
