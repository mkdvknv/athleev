import emailjs from "@emailjs/browser";
import { useEffect, useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const brandPillars = [
  {
    title: "Performance First",
    description: "Formulas built around strength, endurance, recovery, and daily training consistency.",
  },
  {
    title: "Clean Standards",
    description: "Premium ingredients, practical dosing, and a straightforward approach to sports nutrition.",
  },
  {
    title: "Athlete Mindset",
    description: "A brand made for people who train with purpose and keep showing up.",
  },
];

const contactDetails = [
  {
    label: "Location",
    value: "Alevia Healthcare SRO, U Tovaren 1282/31a, Prague 10, 102 00 Czech Republic",
    icon: FaMapMarkerAlt,
  },
  { label: "Email", value: "info@aleviahealthcare.com", icon: FaEnvelope },
  { label: "Phone", value: "+420 123 456 789", icon: FaPhoneAlt },
];

export default function OurStory() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    document.title = "Our Story | Athleev Nutrition";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, phone, subject, message } = form;
    setFormStatus("");

    if (!name || !email || !phone || !subject || !message) {
      setFormStatus("Please fill all fields.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setFormStatus("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    emailjs
      .send(
        "service_r2tskls",
        "template_pdyppe9",
        {
          from_name: name,
          from_email: email,
          phone,
          subject,
          message,
        },
        "GejRxpacpb6vIgVFR"
      )
      .then(() => {
        setFormStatus("Enquiry sent successfully.");
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      })
      .catch(() => {
        setFormStatus("Email sending failed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <section className="relative min-h-[620px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop"
          alt="Athleev athletes training"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/35" />

        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-20 sm:px-8 md:px-12 lg:px-20">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-[#c69a4b]/60 bg-black/55 px-4 py-2 text-xs font-black uppercase tracking-[0.34em] text-[#c69a4b]">
              Athleev Nutrition
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl md:text-7xl">
              BUILT FOR PEOPLE WHO TRAIN WITH PURPOSE
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
              Athleev is a premium sports nutrition brand focused on clean performance, serious recovery, and products that fit the discipline of everyday athletes.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/shop"
                className="ath-btn-primary"
              >
                Explore Products
              </Link>
              <Link
                to="/Athletes"
                className="ath-btn-outline"
              >
                Athletes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 lg:px-20 lg:py-24">
        <div className="ath-section-container grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div className="ath-premium-card overflow-hidden border-[#c69a4b]/55">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
              alt="Athleev gym training environment"
              loading="lazy"
              decoding="async"
              className="h-[420px] w-full object-cover sm:h-[520px]"
            />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c69a4b]">
              Who We Are
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              More Than Just Supplements
            </h2>
            <p className="mt-6 text-base leading-8 text-gray-400">
              Athleev exists for athletes, fitness lovers, and high-output people who care about what they put into their body. Every product is positioned around a clear training goal: build, perform, recover, or stay consistent.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Premium", "Quality"],
                ["Goal", "Focused"],
                ["Athlete", "Driven"],
              ].map(([top, bottom]) => (
                <div key={top} className="rounded-2xl border border-[#c69a4b]/25 bg-[#0d0d0d] p-5">
                  <p className="text-2xl font-black text-[#c69a4b]">{top}</p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-[0.22em] text-gray-500">{bottom}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#c69a4b]/15 bg-[#0d0d0d] px-5 py-20 sm:px-8 md:px-12 lg:px-20 lg:py-24">
        <div className="ath-section-container">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c69a4b]">Our Standards</p>
            <h2 className="mt-4 text-3xl font-black sm:text-5xl">Built Around Better Training</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {brandPillars.map((pillar) => (
              <article key={pillar.title} className="ath-premium-card rounded-[28px] border-[#c69a4b]/25 p-6 transition hover:-translate-y-1 hover:border-[#c69a4b]/70">
                <h3 className="text-xl font-black text-white">{pillar.title}</h3>
                <p className="mt-4 leading-7 text-gray-400">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 text-white sm:px-8 md:px-12 lg:px-20 lg:py-24">
        <div className="ath-section-container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c69a4b]">Contact</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
              Contact Athleev Nutrition
            </h2>
            <p className="mt-5 text-base leading-8 text-gray-400">
              Reach out for product questions, business enquiries, support requests, or partnership conversations.
            </p>
          </div>

          <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          <form onSubmit={handleSubmit} className="ath-premium-card flex h-full flex-col border-[#c69a4b]/45 p-6 sm:p-8 lg:h-[620px] lg:p-9">
            <div>
              <h3 className="mt-3 text-3xl font-black leading-tight text-white">
                Enquiry Form
              </h3>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {[
                ["Your Name", "name"],
                ["Email Address", "email"],
                ["Phone Number", "phone"],
                ["Subject", "subject"],
              ].map(([placeholder, field]) => (
                <input
                  key={field}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="rounded-xl border border-gray-700 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#c69a4b]"
                  aria-label={placeholder}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-1 flex-col">
              <textarea
                rows="4"
                placeholder="Write your message..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="min-h-36 flex-1 resize-none rounded-2xl border border-gray-700 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#c69a4b]"
                aria-label="Message"
              />

              <button
                type="submit"
                disabled={loading}
                className="ath-btn-primary mt-6 w-full py-4 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "ENQUIRY"}
              </button>
              {formStatus && (
                <p className="mt-4 rounded-2xl border border-[#c69a4b]/30 bg-[#17120a] p-4 text-sm font-semibold leading-6 text-gray-200">
                  {formStatus}
                </p>
              )}
            </div>
          </form>

          <aside className="ath-premium-card flex h-full flex-col overflow-hidden border-[#c69a4b]/45 p-6 sm:p-8 lg:h-[620px] lg:p-9">
            <div className="h-[300px] overflow-hidden rounded-2xl border border-[#c69a4b]/20 sm:h-[340px] lg:h-[270px]">
              <iframe
                title="Athleev location map"
                src="https://www.google.com/maps?q=102+00+Praha+102,+Czechia&output=embed"
                className="h-full w-full"
              />
            </div>

            <div className="mt-6 flex flex-1 flex-col">
              <div className="mb-4">
                <h3 className="text-3xl font-black leading-tight text-white">ATHLEEV Nutrition</h3>
              </div>
              <div className="flex-1 divide-y divide-[#2f2f2f] border-y border-[#2f2f2f]">
                {contactDetails.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex gap-4 py-3.5">
                    <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#c69a4b]/35 bg-black text-[#c69a4b]">
                      <Icon aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c69a4b]">{label}</p>
                      <p className="mt-2 break-words text-base leading-7 text-gray-300">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
