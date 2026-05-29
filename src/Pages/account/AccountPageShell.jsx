import { useEffect } from "react";

export default function AccountPageShell({ title, children }) {
  useEffect(() => {
    document.title = `${title} | Athleev Nutrition`;
  }, [title]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black px-5 py-14 text-white sm:px-6 md:px-12 lg:px-20 lg:py-16">
      <section className="ath-section-container">
        <div className="mb-10 border-b border-[#c69a4b]/20 pb-8">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#c69a4b]">
            Athleev Account
          </p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">{title}</h1>
        </div>
        {children}
      </section>
    </main>
  );
}
