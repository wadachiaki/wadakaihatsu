'use client';

import { motion } from "framer-motion";
import Link from 'next/link';

const projects = [
  {
    title: "🖌️ myakugaki",
    desc: "子供から使えるミャクミャクドローアプリ",
    href: "/lab/tools/myakugaki",
  },
  {
    title: "🍬 ぐみーず",
    desc: "カラーごとに性格が違う、しゃべるグミのチャットアプリ",
  },
  {
    title: "🔤 Magic Bite",
    desc: "会話型翻訳アプリ。パクっとひと口の手軽さで、多言語コミュニケーションをかなえる",
  },
  {
    title: "📊 ポチレポ",
    desc: "保育園アンケートサービス。保護者と園の距離をポチッと縮める",
  },
];

export default function AnimatedCardList() {
  return (
    <section className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
      {projects.map((project, i) => {
        const card = (
          <motion.div
            className={`rounded-2xl p-6 backdrop-blur bg-[#fffaf8]/70 dark:bg-[#fffaf8]/10 shadow-md border border-gray-100 flex flex-col justify-between h-full max-w-xs transition-all duration-300 ${project.href ? 'cursor-pointer hover:shadow-lg' : ''
              }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.15, ease: 'easeOut' }
            }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-heading mb-2">{project.title}</h3>
            <p className="text-xs font-body">{project.desc}</p>
            {project.href && (
              <span className="mb-4 inline-block text-xs text-red-500 font-medium">
                つかってみる
              </span>
            )}
          </motion.div>
        );

        return project.href ? (
          <Link href={project.href} key={project.title}>
            {card}
          </Link>
        ) : (
          <div key={project.title}>{card}</div>
        );
      })}

    </section>
  );
}
