// src/app/page.js

export default function Home() {
  return (
    <div >
      <section className="flex flex-col gap-2">
      {/* トップイラストとタイトル */}
        <h1>wadakaihatsuとは</h1>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                    {`私たちの考える「おいしい」は、特別なものではありません。
たとえば、
初めてうまくできたたまご焼き、
好きな人が作ってくれたお味噌汁、
河原でほおばるおむすび…

そんな、小さな"ほっとするあの味とひととき"を思い浮かべると
自然と心がじんわり満たされる。
これが、私たちにとってのおいしさです。

そんな“おいしいと感じる日常”をテクノロジーで守り、
育てることを目標にしたプロジェクトです。

現代の忙しさの中では、「小さな幸せ」や「心地よさ」が後回しになりがちです。
私たちは、そんな慌ただしい日々のなかでも
ちょっと立ち止まって「おいしい」を感じられるひとときを届けたいと考えています。
その想いこそが、wadakaihatsu の原動力です。
`}
                </p>

                <h1>wadakaihatsuの活動</h1>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                    {`執筆中・・・`}</p>

                <h1>wadakaihatsuのよてい</h1>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                    {`これから wadakaihatsu ブランドサイトでは、
・これまで手がけてきたアプリやキャラクターの紹介
・それぞれのプロジェクトに込めた“おいしさ”のストーリー
・今後の展開予定や取り組み
などをお届けします。`}</p>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                    {`みなさんの日常に寄り添うコンテンツを制作していきます。
お楽しみに。`}</p>

      </section>
    </div>
  );
}
