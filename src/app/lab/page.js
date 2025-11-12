// src/app/lab/page.js
import AnimatedCardList from "@/app/components/AnimatedCardList";

export default function Home() {
  return (
    <div className="min-h-screen px-4 sm:px-8 md:px-20 flex flex-col items-center gap-6">
      {/* トップイラストとタイトル */}
      <section className="flex flex-col gap-4">
        <h1>
          つくって遊ぶ、自由な研究室
        </h1>
        <p className="pt-4">
          OISHII CLUB LABでは、だれかの役に立つツールを作るのはもちろん、だれが使うのかわからないものをつくってみたり、ふざけてみたりを楽しんでいます。
        </p>
      </section>

      {/* カードセクション */}
      <AnimatedCardList />
    </div>
  );
}
