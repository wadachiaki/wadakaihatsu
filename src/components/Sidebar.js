// src/components/Sidebar.js
import Link from 'next/link';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* 背景オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[1000]"
          onClick={onClose}
          aria-label="背景クリックで閉じる"
        />
      )}

      {/* サイドバー本体 */}
      <aside
        className={`fixed top-0 left-0 h-full backdrop-blur bg-[#fffaf8]/70 dark:bg-[#100e0d]/70 shadow-lg z-[1001] flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-60 md:w-60`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            aria-label="メニューを閉じる"
            className="text-2xl hover:opacity-70"
          >
            ×
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4 font-body m-2">
          <Link href="/" className="uppercase font-bold text-s mt-6 mb-2">
            wadakaihatsu
          </Link>

          <div className="flex flex-col">
            <Link href="/lab" className="uppercase font-bold text-s mt-6 mb-2">
            wadakaihatsu LAB
          </Link>
            <Link
              href="/lab/tools/myakugaki"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm pl-4 mt-1 mb-2">
              ・myakugaki
            </Link>
            {/* colorizer非表示中
            <Link
              href="/lab/tools/colorizer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm pl-4 mt-1 mb-2">
              ・colorizer
            </Link>
            */}
          </div>

          <Link href="/contact" className="uppercase font-bold text-s mt-6 mb-2">
            Contact
          </Link>
        </nav>
      </aside>
    </>
  );
}
