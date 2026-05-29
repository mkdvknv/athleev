import { useEffect } from "react";

const policySections = [
  {
    title: "Information We Collect",
    body:
      "We may collect personal details such as your full name, email address, shipping address, phone number, and payment information when you place an order or contact our support team.",
  },
  {
    title: "How We Use Your Information",
    body:
      "Your data is used to process orders, improve website experience, provide customer support, send order updates, and share important promotions or product launches.",
  },
  {
    title: "Data Protection & Security",
    body:
      "ATHLEEV uses secure technologies and industry-standard protection methods to keep your personal information safe. We never sell or share your private data with third parties without consent.",
  },
  {
    title: "Cookies & Analytics",
    body:
      "Our website may use cookies and analytics tools to improve performance, personalize user experience, and understand customer behavior.",
  },
  {
    title: "Contact Us",
    body:
      "If you have any questions regarding this Privacy Policy, feel free to contact us at support@athleev.com.",
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | Athleev Nutrition";
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black px-5 py-16 text-white sm:px-8 md:px-12 lg:px-20 lg:py-20">
      <section className="mx-auto max-w-6xl">
        <div className="ath-premium-card border-[#c69a4b]/25 p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c69a4b]">
            Athleev Legal
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Privacy <span className="text-[#c69a4b]">Policy</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-gray-300">
            At ATHLEEV Nutrition, your privacy and data security are extremely important to us. This Privacy Policy explains how we collect, use, and protect your personal information while using our website and services.
          </p>
          <div className="mt-8 flex flex-col gap-3 border-t border-[#2f2f2f] pt-6 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Applies to Athleev website visitors and customers.</span>
            <span className="font-semibold text-[#c69a4b]">Last updated: 2026</span>
          </div>
        </div>

        <div className="mt-10 grid gap-6">
          {policySections.map((section, index) => (
            <article
              key={section.title}
              className="ath-premium-card rounded-[28px] border-[#c69a4b]/20 bg-[#0d0d0d] p-5 transition hover:border-[#c69a4b]/50 sm:p-8"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#c69a4b]/40 bg-black text-sm font-black text-[#c69a4b]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-2xl font-black text-white">{section.title}</h2>
                  <p className="mt-4 max-w-4xl text-base leading-8 text-gray-400">{section.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="ath-premium-card mt-10 rounded-[28px] border-[#c69a4b]/35 p-6 text-center sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c69a4b]">
            Need Help?
          </p>
          <h2 className="mt-3 text-2xl font-black">Questions about your privacy?</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-gray-400">
            Contact the Athleev support team for questions about data, privacy, orders, or account information.
          </p>
          <a
            href="mailto:support@athleev.com"
            className="ath-btn-primary mt-6"
          >
            support@athleev.com
          </a>
        </div>
      </section>
    </main>
  );
}
