import { useEffect, useState } from "react";

export default function Checkout({ cart, getTotalInINR, formatPrice, selectedCurrency }) {
  const [paymentMessage, setPaymentMessage] = useState("");
  const totalInINR = getTotalInINR();
  const totalInSelectedCurrency = totalInINR * (selectedCurrency?.rate || 1);
  const amountForPayment = Math.max(Math.round(totalInSelectedCurrency * 100), 0);
  const hasPayableCart = cart.length > 0 && amountForPayment > 0;
  const fieldClass =
    "w-full rounded-full border border-[#c69a4b]/35 bg-black px-5 py-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#c69a4b] focus:shadow-[0_0_24px_rgba(198,154,75,0.14)]";
  const panelClass = "ath-premium-card p-5 sm:p-8";

  useEffect(() => {
    document.title = "Checkout | Athleev Nutrition";
  }, []);

  const handlePayment = () => {
    setPaymentMessage("");

    if (!hasPayableCart) {
      setPaymentMessage("Your cart is empty. Add products before checkout.");
      return;
    }

    if (!window.Razorpay) {
      setPaymentMessage("Payment service is unavailable right now. Please try again shortly.");
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      setPaymentMessage("Payment is not configured yet. Please contact Athleev support.");
      return;
    }

    const razorpay = new window.Razorpay({
      key: razorpayKey,
      amount: amountForPayment,
      currency: selectedCurrency?.code || "INR",
      name: "ATHLEEV",
      description: "Gym Supplement Payment",
      handler: function () {
        setPaymentMessage("Payment successful. Your Athleev order is being processed.");
      },
      modal: {
        ondismiss: function () {
          setPaymentMessage("Payment was closed before completion.");
        },
      },
      theme: {
        color: "#c69a4b",
      },
    });

    razorpay.open();
  };

  return (
    <section className="min-h-screen overflow-x-hidden bg-black px-5 py-14 text-white sm:px-8 md:px-12 lg:px-20 lg:py-16">
      <div className="mb-10 border-b border-[#c69a4b]/20 pb-8 sm:mb-12">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c69a4b]">
          Secure Payment
        </p>
        <h1 className="mt-4 text-4xl font-black uppercase leading-tight sm:text-5xl">
          CHECK<span className="text-[#c69a4b]">OUT</span>
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
          Complete your details and confirm your Athleev order.
        </p>
      </div>

      <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-10">
        <div className={panelClass}>
          <h2 className="mb-6 text-2xl font-black uppercase tracking-[0.04em] sm:text-3xl">
            Billing Details
          </h2>
          <div className="space-y-5">
            <input type="text" placeholder="Full Name" className={fieldClass} aria-label="Full name" />
            <input type="email" placeholder="Email Address" className={fieldClass} aria-label="Email address" />
            <input type="text" placeholder="Phone Number" className={fieldClass} aria-label="Phone number" />
            <textarea
              placeholder="Shipping Address"
              rows="4"
              className={`${fieldClass} min-h-32 resize-none rounded-3xl leading-relaxed`}
              aria-label="Shipping address"
            />
          </div>
        </div>

        <div className={`${panelClass} h-fit`}>
          <h2 className="mb-6 text-2xl font-black uppercase tracking-[0.04em] sm:text-3xl">
            Order Summary
          </h2>
          <div className="mb-6 space-y-3">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="flex min-w-0 flex-wrap justify-between gap-2 text-sm text-gray-300">
                  <p>{item.name} x {item.qty || 1}</p>
                  <p>{formatPrice(item.basePrice * (item.qty || 1), selectedCurrency)}</p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-[#c69a4b]/25 bg-[#17120a] p-4 text-sm font-semibold text-gray-300">
                Your cart is empty. Add products to review your order total here.
              </p>
            )}
          </div>

          <div className="space-y-4 text-gray-300">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>{formatPrice(totalInINR, selectedCurrency)}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>Free</p>
            </div>
            <div className="flex justify-between gap-4 border-t border-gray-700 pt-4 text-xl font-black text-white">
              <p>Total</p>
              <p className="text-[#c69a4b]">{formatPrice(totalInINR, selectedCurrency)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePayment}
            disabled={!hasPayableCart}
            className="ath-btn-primary mt-8 w-full px-6 py-4 disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            {hasPayableCart ? "Pay Now" : "Cart Empty"}
          </button>
          {paymentMessage && (
            <p className="mt-5 rounded-2xl border border-[#c69a4b]/30 bg-[#17120a] p-4 text-sm font-semibold leading-6 text-gray-200">
              {paymentMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
