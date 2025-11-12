export default function ContactPage() {
  return (
    <section className="min-h-screen px-4 sm:px-8 md:px-20 flex flex-col items-center gap-12">
      <section className="flex flex-col gap-4">
        <h1>Contact</h1>
        <p>
          お問い合わせ・コラボのご相談などは、
          <br />
          InstagramのDMからお気軽にどうぞ ✉️
        </p>
      </section>
      <a
        href="https://www.instagram.com/lab.oishii.club/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block backdrop-blur bg-[#fffaf8]/70 dark:bg-[#fffaf8]/10 shadow-md border border-gray-100 rounded px-5 py-2 text-sm font-medium transition"
      >
        @lab.oishii.club をひらく
      </a>
    </section>
  );
}
