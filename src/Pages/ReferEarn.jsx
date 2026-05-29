import { Link } from "react-router-dom";
import { useState } from "react";

import AccountPageShell from "./account/AccountPageShell";

export default function ReferEarn() {
  const [message, setMessage] = useState("");
  const referralCode = "ATHLEEVFIT";

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setMessage("Referral code copied.");
    } catch {
      setMessage("Select and copy the referral code.");
    }
  };

  return (
    <AccountPageShell title="Refer & Earn">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="ath-premium-card border-[#c69a4b]/45 p-6 shadow-[#c69a4b]/10 sm:p-8 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c69a4b]">
            Referral Code
          </p>
          <div className="mt-5 rounded-[28px] border border-[#c69a4b]/35 bg-black p-6">
            <p className="break-all text-4xl font-black text-[#c69a4b]">{referralCode}</p>
          </div>
          <button type="button" onClick={copyReferralCode} className="ath-btn-primary mt-6 px-6 py-4">
            Copy Code
          </button>
          {message && (
            <p className="mt-5 rounded-2xl border border-[#c69a4b]/30 bg-[#17120a] p-4 text-sm font-semibold text-gray-200">
              {message}
            </p>
          )}
        </div>

        <div className="ath-premium-card border-[#2f2f2f] p-6 sm:p-8">
          <h2 className="text-3xl font-black">Share Athleev</h2>
          <p className="mt-4 leading-relaxed text-gray-400">
            Invite your training circle to Athleev Nutrition using your referral
            code and keep the performance community growing.
          </p>
          <Link to="/shop" className="ath-btn-outline mt-8 px-6 py-4">
            Explore Products
          </Link>
        </div>
      </div>
    </AccountPageShell>
  );
}
