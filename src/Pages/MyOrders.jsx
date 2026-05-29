import { Link } from "react-router-dom";

import AccountPageShell from "./account/AccountPageShell";

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 6H6" />
    </svg>
  );
}

export default function MyOrders() {
  return (
    <AccountPageShell title="My Orders">
      <div className="ath-premium-card mx-auto max-w-4xl border-[#c69a4b]/45 p-8 text-center shadow-[#c69a4b]/10 md:p-12">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#c69a4b]/40 bg-[#17120a] text-2xl text-[#c69a4b]">
          <CartIcon />
        </div>
        <h2 className="mt-6 text-3xl font-black">No orders found</h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-400">
          Your Athleev purchases will be listed here after checkout.
        </p>
        <Link to="/shop" className="ath-btn-primary mt-8 px-6 py-4">
          Continue Shopping
        </Link>
      </div>
    </AccountPageShell>
  );
}
