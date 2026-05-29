import { Link } from "react-router-dom";
import { useEffect } from "react";
import athletes from "../assets/Athletes.jpg";

const athleteValues = [
  {
    title: "Discipline",
    description: "Built for athletes who show up before motivation arrives.",
  },
  {
    title: "Performance",
    description: "Nutrition support for strength, recovery, endurance, and focus.",
  },
  {
    title: "Community",
    description: "A future roster of athletes who represent the Athleev mindset.",
  },
];

export default function Athletes() {
  useEffect(() => {
    document.title = "Athletes | Athleev Nutrition";
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <section className="relative min-h-[650px] overflow-hidden">
        <img
          src={athletes}
          alt="Athleev athletes"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/35" />

        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-center px-5 py-20 sm:px-8 md:px-12 lg:px-20">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-[#c69a4b]/60 bg-black/60 px-4 py-2 text-xs font-black uppercase tracking-[0.34em] text-[#c69a4b]">
              Athleev Athletes
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl md:text-7xl">
              BUILT WITH THE ATHLETE MINDSET
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
              Our athlete roster is coming soon. Until then, Athleev is built for every lifter, runner, competitor, and everyday performer who trains with intent.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/shop"
                className="ath-btn-primary"
              >
                Shop Performance
              </Link>
              <Link
                to="/our-story"
                className="ath-btn-outline"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 lg:px-20 lg:py-24">
        <div className="ath-section-container">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c69a4b]">
                Coming Soon
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
                A roster that represents work, consistency, and results.
              </h2>
              <p className="mt-6 leading-8 text-gray-400">
                The Athleev athlete program will spotlight people who live the brand values: disciplined training, smart recovery, and a relentless standard for improvement.
              </p>
            </div>

            <div className="ath-premium-card border-[#c69a4b]/35 p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Roster", "Soon"],
                  ["Training", "Driven"],
                  ["Premium", "Nutrition"],
                ].map(([top, bottom]) => (
                  <div key={top} className="rounded-2xl border border-[#c69a4b]/25 bg-black p-5 text-center">
                    <p className="text-2xl font-black text-[#c69a4b]">{top}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.22em] text-gray-500">{bottom}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-3xl border border-[#2f2f2f] bg-[#0d0d0d] p-6">
                <p className="text-sm font-black uppercase tracking-[0.28em] text-[#c69a4b]">
                  Athlete applications
                </p>
                <p className="mt-3 leading-7 text-gray-400">
                  Partnerships and athlete features will open as the brand community grows.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {athleteValues.map((value) => (
              <article
                key={value.title}
                className="ath-premium-card rounded-[28px] border-[#c69a4b]/25 p-6 transition hover:-translate-y-1 hover:border-[#c69a4b]/70"
              >
                <h3 className="text-xl font-black text-white">{value.title}</h3>
                <p className="mt-4 leading-7 text-gray-400">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#c69a4b]/15 bg-[#0d0d0d] px-5 py-20 sm:px-8 md:px-12 lg:px-20">
        <div className="ath-section-container ath-premium-shadow flex flex-col gap-6 rounded-[32px] border border-[#c69a4b]/35 bg-black p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c69a4b]">
              Train Like An Athlete
            </p>
            <h2 className="mt-3 text-3xl font-black">Fuel your next session with Athleev.</h2>
          </div>
          <Link
            to="/shop"
            className="ath-btn-primary"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </main>
  );
}
