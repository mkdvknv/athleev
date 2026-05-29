import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

import logo from "./assets/Athleev Logo.png";
import { products as productList } from "./data/products";
import {
  addShopifyCartItem,
  fetchStorefrontProducts,
  setShopifyCartItemQuantity,
  shopifyConfig,
} from "./shopify";
import {
  accountEmailPattern,
  accountMobilePattern,
  clearAccountSession,
  createAccountSalt,
  dispatchAccountSessionChange,
  hashAccountPassword,
  normalizeAccountEmail,
  normalizeAccountMobile,
  readAccountSession,
  readAccountUsers,
  saveAccountUsers,
  writeAccountSession,
} from "./utils/account";

const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy"));
const Checkout = lazy(() => import("./Pages/Checkout"));
const Cart = lazy(() => import("./Pages/Cart"));
const Shop = lazy(() => import("./Pages/Shop"));
const ProductGoals = lazy(() => import("./Pages/ProductGoals"));
const OurStory = lazy(() => import("./Pages/OurStory"));
const Athletes = lazy(() => import("./Pages/Athletes"));
const ProductPage = lazy(() => import("./Pages/ProductPage"));
const MyAccount = lazy(() => import("./Pages/MyAccount"));
const MyOrders = lazy(() => import("./Pages/MyOrders"));
const MyAddress = lazy(() => import("./Pages/MyAddress"));
const ReferEarn = lazy(() => import("./Pages/ReferEarn"));
const Wishlist = lazy(() => import("./Pages/Wishlist"));

const currencyOptions = [
  { code: "INR", symbol: "₹", rate: 1, label: "Indian Rupee" },
  { code: "USD", symbol: "$", rate: 0.012, label: "US Dollar" },
  { code: "EUR", symbol: "€", rate: 0.011, label: "Euro" },
  { code: "GBP", symbol: "£", rate: 0.0095, label: "British Pound" },
  { code: "AED", symbol: "AED", rate: 0.044, label: "UAE Dirham" },
];

const productsByGoals = [
  {
    id: "muscle-building",
    title: "Muscle Building",
    products: [
      { label: "Athleev Whey Protein", slug: "athleev-whey-protein" },
      { label: "Athleev Mass Gainer", slug: "athleev-mass-gainer" },
      { label: "Athleev Creatine", slug: "athleev-creatine" },
      { label: "Athleev L-Glutamine", slug: "athleev-l-glutamine" },
    ],
  },
  {
    id: "performance-boosters",
    title: "Performance Boosters",
    products: [
      { label: "Athleev Pre Workout", slug: "athleev-pre-workout" },
      { label: "Athleev EAA", slug: "athleev-eaa" },
      { label: "Athleev BCAA", slug: "athleev-bcaa" },
      { label: "Athleev AKG", slug: "athleev-akg" },
      { label: "Athleev Beta Alanine", slug: "athleev-beta-alanine" },
    ],
  },
  {
    id: "weight-management",
    title: "Weight Management",
    products: [
      { label: "Athleev Whey Isolate", slug: "athleev-whey-isolate" },
    ],
  },
  {
    id: "healthy-lifestyle",
    title: "Healthy Lifestyle",
    products: [
      { label: "Athleev Multivitamin", slug: "athleev-multivitamin" },
      { label: "Athleev Omega 3 Fish Oil", slug: "athleev-omega-3-fish-oil" },
      { label: "Athleev Post Workout", slug: "athleev-post-workout" },
      { label: "Athleev Testosterone Booster", slug: "athleev-testosterone-booster" },
    ],
  },
];

const footerSocialLinks = [
  // TODO: Add verified Athleev social profile URLs when they are available.
  { label: "Instagram", href: null, icon: FaInstagram },
  { label: "Facebook", href: null, icon: FaFacebookF },
  { label: "YouTube", href: null, icon: FaYoutube },
  { label: "LinkedIn", href: null, icon: FaLinkedinIn },
];

const footerProductLinks = [
  { label: "Whey Protein", to: "/muscle-building/athleev-whey-protein" },
  { label: "Creatine", to: "/muscle-building/athleev-creatine" },
  { label: "Mass Gainer", to: "/muscle-building/athleev-mass-gainer" },
  { label: "Pre Workout", to: "/performance-boosters/athleev-pre-workout" },
];

const footerQuickLinks = [
  { label: "About Us", to: "/our-story" },
  { label: "Athletes", to: "/Athletes" },
  { label: "Shop", to: "/shop" },
  { label: "Privacy Policy", to: "/privacy-policy" },
];

const getProductPath = (product) =>
  product?.slug && product?.categorySlug
    ? `/${product.categorySlug}/${product.slug}`
    : `/product/${product.id}`;

const europeCountryCodes = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "NO", "CH"
]);

const getDefaultCurrencyCode = (countryCode) => {
  switch (countryCode) {
    case "IN":
      return "INR";
    case "US":
      return "USD";
    case "GB":
    case "UK":
      return "GBP";
    case "AE":
      return "AED";
    default:
      if (europeCountryCodes.has(countryCode)) return "EUR";
      return "INR";
  }
};

const formatPrice = (amountInINR, currency) => {
  if (!currency) return `₹${amountInINR.toFixed(0)}`;
  const converted = amountInINR * currency.rate;
  const decimals = currency.code === "INR" || currency.code === "AED" ? 0 : 2;
  const value = converted.toFixed(decimals);
  return currency.code === "AED" ? `${currency.symbol} ${value}` : `${currency.symbol}${value}`;
};

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SearchIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function HeartIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function CartIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 6H6" />
    </svg>
  );
}

function MenuIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function HomePage({
  addToCart,
  increaseQty,
  decreaseQty,
  goals,
  products,
  formatPrice,
  wishlist,
  toggleWishlist,
  cart,
}) {
  useEffect(() => {
    document.title = "Athleev Nutrition | Premium Sports Supplements";
  }, []);

  const bestSellerProducts = products.slice(0, 3);
  const trendingProducts = products.slice(3, 6);
  const wishlistIds = new Set(wishlist.map((item) => item.id));
  const cartItemsById = new Map(cart.map((item) => [item.id, item]));
  const heroStats = [
    { value: "10K+", label: "Customers" },
    { value: "100%", label: "Authentic" },
    { value: "Fast", label: "Delivery" },
  ];
  const sectionShell = "px-5 py-20 sm:px-8 md:px-12 lg:px-20 lg:py-24";
  const sectionHeader = "ath-section-heading";
  const goldButton = "ath-btn-primary";
  const outlineButton = "ath-btn-outline";

  const renderCartAction = (product) => {
    const cartItem = cartItemsById.get(product.id);

    if (!cartItem) {
      return (
        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={product.availableForSale === false}
          className="ath-btn-primary mt-6 w-full px-5 py-3 disabled:cursor-not-allowed disabled:bg-gray-600"
        >
          {product.availableForSale === false ? "Sold Out" : "Add To Cart"}
        </button>
      );
    }

    return (
      <div className="mt-6 rounded-[28px] border border-[#c69a4b]/80 bg-white/[0.04] p-2.5 shadow-[0_18px_45px_rgba(198,154,75,0.18)] backdrop-blur">
        <div className="mb-2.5 text-center text-[11px] font-black uppercase tracking-[0.28em] text-[#d4b16f]">
          Added to Cart
        </div>
        <div className="flex items-center justify-between overflow-hidden rounded-full border border-[#c69a4b]/40 bg-gradient-to-r from-[#080808] via-[#15120c] to-[#080808] p-1 shadow-inner shadow-black">
          <button
            type="button"
            onClick={() => decreaseQty(product.id)}
            className="grid h-12 w-12 place-items-center rounded-full text-2xl font-black text-[#c69a4b] transition duration-200 hover:scale-105 hover:bg-[#c69a4b] hover:text-black active:scale-95"
            aria-label={`Decrease ${product.name} quantity`}
          >
            -
          </button>
          <span className="grid h-12 min-w-16 place-items-center rounded-full border border-[#c69a4b]/30 bg-black/70 px-5 text-lg font-black text-white shadow-[0_0_18px_rgba(198,154,75,0.16)]">
            {cartItem.qty || 1}
          </span>
          <button
            type="button"
            onClick={() => increaseQty(product.id)}
            className="grid h-12 w-12 place-items-center rounded-full text-2xl font-black text-[#c69a4b] transition duration-200 hover:scale-105 hover:bg-[#c69a4b] hover:text-black active:scale-95"
            aria-label={`Increase ${product.name} quantity`}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-[680px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop"
          alt="Athlete training in a gym"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />
        <div className="relative z-10 flex min-h-[680px] items-center px-5 py-20 sm:px-8 md:px-12 lg:px-20">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-[#c69a4b]/60 bg-black/50 px-4 py-2 text-xs font-black uppercase tracking-[0.35em] text-[#c69a4b]">
              Athleev Performance Nutrition
            </p>
            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              BUILT FOR
              <span className="block text-[#c69a4b]">SERIOUS ATHLETES</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
              Premium supplements for strength, recovery, performance, and daily consistency.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link to="/shop" className={goldButton}>
                Shop Products
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-[#c69a4b]/30 bg-black/55 p-4 text-center backdrop-blur">
                  <p className="text-2xl font-black text-[#c69a4b]">{stat.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={sectionShell}>
        <div className="ath-section-container">
          <h2 className={sectionHeader}>
            SHOP BY <span className="text-[#c69a4b]">GOALS</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5 xl:gap-6">
            {goals.map((goal) => (
              <div
                key={goal.title}
                className="ath-product-card group flex h-full flex-col overflow-hidden border-[#c69a4b]/70 hover:-translate-y-2"
              >
                <div className="relative h-56 overflow-hidden lg:h-48 xl:h-56">
                  <img
                    src={goal.img}
                    alt={`${goal.title} training goal`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full border border-[#c69a4b]/60 bg-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#c69a4b]">
                    Goal
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5 lg:p-4 xl:p-5">
                  <h3 className="font-black text-xl lg:text-lg xl:text-xl">{goal.title}</h3>
                  <p className="mt-2 min-h-[42px] text-sm leading-relaxed text-gray-400">{goal.description}</p>
                  <Link to="/shop" className={`mt-6 block w-full text-center ${outlineButton}`}>
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${sectionShell} bg-black text-white`}>
        <div className="ath-section-container">
          <h2 className={sectionHeader}>
            SHOP BY <span className="text-[#c69a4b]">PRODUCT</span>
          </h2>
        <div className="grid min-h-[620px] items-stretch gap-8 lg:grid-cols-[280px_1fr]">
          <div className="grid gap-6 auto-rows-fr h-full">
            <div className="ath-product-card h-full overflow-hidden border-[#c69a4b]">
              <div className="relative h-full min-h-[280px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop"
                  alt="Athlete lifting weights"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                  <div>
                    <p className="uppercase tracking-[4px] text-sm text-[#d4b16f] mb-4">Premium Picks</p>
                    <p className="text-5xl md:text-6xl font-black leading-tight text-[#c69a4b]">BEST</p>
                    <p className="text-5xl md:text-6xl font-black leading-tight mt-1">SELLERS</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm md:text-base max-w-md">
                      Discover our highest-rated formulas for strength, recovery, and performance. Every product is crafted to deliver results.
                    </p>
                    <Link to="/shop" className={goldButton}>
                      Shop Best Sellers
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="ath-product-card h-full overflow-hidden border-[#c69a4b]">
              <div className="relative h-full min-h-[280px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop"
                  alt="Strength training equipment"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                  <div>
                    <p className="uppercase tracking-[4px] text-sm text-[#d4b16f] mb-4">Must Have</p>
                    <p className="text-5xl md:text-4xl font-black leading-tight text-[#c69a4b]">TRENDING</p>
                    <p className="text-5xl md:text-4xl font-black leading-tight mt-1">NOW</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm md:text-base max-w-md">
                      Stay ahead with formulas that athletes love. Shop the latest performance essentials and premium recovery staples.
                    </p>
                    <Link to="/shop" className={`mt-7 inline-flex ${goldButton}`}>
                      Browse Trending
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-rows-[1fr_1fr] gap-6 h-full">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr h-full">
              {bestSellerProducts.map((product, index) => (
                <div
                  key={`best-${index}`}
                  className={`ath-product-card group relative flex h-full flex-col justify-between p-5 ${cartItemsById.has(product.id) ? "border-[#c69a4b] shadow-[0_0_28px_rgba(198,154,75,0.18)]" : "border-[#c69a4b]/70"}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`absolute right-4 top-4 z-10 h-11 w-11 rounded-full border text-xl font-black transition ${wishlistIds.has(product.id) ? "border-[#c69a4b] bg-[#c69a4b] text-black" : "border-[#c69a4b] bg-black/80 text-[#c69a4b] hover:bg-[#c69a4b] hover:text-black"}`}
                    aria-label={`${wishlistIds.has(product.id) ? "Remove" : "Add"} ${product.name} ${wishlistIds.has(product.id) ? "from" : "to"} wishlist`}
                  >
                    {wishlistIds.has(product.id) ? "♥" : "♡"}
                  </button>
                  <div>
                    <div className="flex h-[300px] items-center justify-center overflow-hidden rounded-3xl border border-[#c69a4b]/35 bg-gradient-to-b from-[#f8f5ee] to-[#ded4c3] p-0 shadow-[inset_0_1px_10px_rgba(0,0,0,0.08),0_12px_28px_rgba(0,0,0,0.18)] sm:h-[320px] lg:h-[260px] xl:h-[300px]">
                      <img
                        src={product.img}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full scale-[1.42] object-contain object-center drop-shadow-[0_22px_22px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-out group-hover:scale-[1.55]"
                      />
                    </div>
                    <div className="mt-5">
                      <p className="text-xs uppercase tracking-[3px] text-gray-400">Best Seller</p>
                      <h3 className="font-black text-xl mt-3">{product.name}</h3>
                      <p className="mt-4 text-2xl font-black text-[#c69a4b]">{formatPrice(product.basePrice)}</p>
                    </div>
                  </div>
                  {renderCartAction(product)}
                </div>
              ))}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr h-full">
              {trendingProducts.map((product, index) => (
                <div
                  key={`trend-${index}`}
                  className={`ath-product-card group relative flex h-full flex-col justify-between p-5 ${cartItemsById.has(product.id) ? "border-[#c69a4b] shadow-[0_0_28px_rgba(198,154,75,0.18)]" : "border-[#c69a4b]/70"}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`absolute right-4 top-4 z-10 h-11 w-11 rounded-full border text-xl font-black transition ${wishlistIds.has(product.id) ? "border-[#c69a4b] bg-[#c69a4b] text-black" : "border-[#c69a4b] bg-black/80 text-[#c69a4b] hover:bg-[#c69a4b] hover:text-black"}`}
                    aria-label={`${wishlistIds.has(product.id) ? "Remove" : "Add"} ${product.name} ${wishlistIds.has(product.id) ? "from" : "to"} wishlist`}
                  >
                    {wishlistIds.has(product.id) ? "♥" : "♡"}
                  </button>
                  <div>
                    <div className="flex h-[300px] items-center justify-center overflow-hidden rounded-3xl border border-[#c69a4b]/35 bg-gradient-to-b from-[#f8f5ee] to-[#ded4c3] p-0 shadow-[inset_0_1px_10px_rgba(0,0,0,0.08),0_12px_28px_rgba(0,0,0,0.18)] sm:h-[320px] lg:h-[260px] xl:h-[300px]">
                      <img
                        src={product.img}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full scale-[1.42] object-contain object-center drop-shadow-[0_22px_22px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-out group-hover:scale-[1.55]"
                      />
                    </div>
                    <div className="mt-1 max-w-full overflow-hidden">
                     <p className="text-[10px] uppercase tracking-[1px] text-[#d4b16f] mb-1 truncate">
  Trending Now
</p>
                      <h3 className="font-black text-xl mt-3">{product.name}</h3>
                      <p className="mt-1 text-2xl font-black text-[#c69a4b]">{formatPrice(product.basePrice)}</p>
                    </div>
                  </div>
                  {renderCartAction(product)}
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className={sectionShell}>
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#c69a4b]">
            <img
              src="https://images.unsplash.com/photo-1622484212850-eb596d769edc?q=80&w=1200&auto=format&fit=crop"
              alt="Athlete preparing for training"
              loading="lazy"
              decoding="async"
              className="w-full h-[320px] object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute top-10 left-10 z-10">
              <p className="mb-4 inline-block rounded-full bg-[#c69a4b] px-4 py-1 text-xs font-black uppercase tracking-[0.18em] text-black">ONE DAY ONLY</p>
              <h3 className="text-5xl font-black">20% OFF</h3>
              <p className="mt-2 text-gray-300">ALL GYM SUPPLEMENTS</p>
              <Link to="/shop" className={`mt-4 inline-flex ${goldButton}`}>
                Shop Now
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#c69a4b]">
            <img
              src="https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?q=80&w=1200&auto=format&fit=crop"
              alt="Supplement routine and fitness lifestyle"
              loading="lazy"
              decoding="async"
              className="w-full h-[320px] object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute top-10 left-10 z-10">
              <p className="mb-4 inline-block rounded-full bg-[#c69a4b] px-4 py-1 text-xs font-black uppercase tracking-[0.18em] text-black">ONE DAY ONLY</p>
              <h3 className="text-5xl font-black">20% OFF</h3>
              <p className="mt-2 text-gray-300">ALL GYM SUPPLEMENTS</p>
              <Link to="/shop" className={`mt-4 inline-flex ${goldButton}`}>
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={sectionShell}>
        <div className="ath-section-container">
        <h2 className={sectionHeader}>ATHLEEV <span className="text-[#c69a4b]">MOMENTS</span></h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {goals.map((goal, index) => (
            <img
              key={`${goal.title}-${index}`}
              src={goal.img}
              alt={`${goal.title} moment`}
              loading="lazy"
              decoding="async"
              className="rounded-3xl h-52 min-w-[220px] border border-[#c69a4b] object-cover"
            />
          ))}
        </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(() => {
    if (typeof window === "undefined") return "INR";
    const storedCurrency = window.localStorage.getItem("athleevCurrency");
    return currencyOptions.some((currency) => currency.code === storedCurrency)
      ? storedCurrency
      : "INR";
  });
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState(productList);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGoalsMenuOpen, setIsGoalsMenuOpen] = useState(false);
  const [accountSession, setAccountSession] = useState(readAccountSession);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountModalMode, setAccountModalMode] = useState("login");
  const [accountLoginForm, setAccountLoginForm] = useState({ identifier: "", password: "" });
  const [accountRegisterForm, setAccountRegisterForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [accountFormErrors, setAccountFormErrors] = useState({});
  const [accountStatus, setAccountStatus] = useState("");
  const [isAccountSubmitting, setIsAccountSubmitting] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const selectedCurrency = useMemo(
    () => currencyOptions.find((currency) => currency.code === selectedCurrencyCode) || currencyOptions[0],
    [selectedCurrencyCode]
  );

  useEffect(() => {
    const storedCurrency = window.localStorage.getItem("athleevCurrency");
    if (storedCurrency && currencyOptions.some((currency) => currency.code === storedCurrency)) {
      return;
    }

    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        const detected = getDefaultCurrencyCode(data.country_code || "IN");
        setSelectedCurrencyCode(detected);
      })
      .catch(() => {
        setSelectedCurrencyCode("INR");
      });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("athleevCurrency", selectedCurrencyCode);
  }, [selectedCurrencyCode]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const clickedInsideNav = navRef.current?.contains(event.target);
      const clickedInsideMobileMenu = mobileMenuRef.current?.contains(event.target);
      if (!clickedInsideNav && !clickedInsideMobileMenu) {
        setIsGoalsMenuOpen(false);
        setIsMobileMenuOpen(false);
        setIsAccountDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsGoalsMenuOpen(false);
        setIsMobileMenuOpen(false);
        setIsAccountDropdownOpen(false);
        setIsAccountModalOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isAccountModalOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isAccountModalOpen]);

  useEffect(() => {
    const syncAccountSession = () => {
      setAccountSession(readAccountSession());
      setIsAccountDropdownOpen(false);
    };

    window.addEventListener("athleev-account-session-change", syncAccountSession);

    return () => {
      window.removeEventListener("athleev-account-session-change", syncAccountSession);
    };
  }, []);

  useEffect(() => {
    if (!shopifyConfig.isConfigured) return undefined;

    let cancelled = false;

    fetchStorefrontProducts()
      .then((storefrontProducts) => {
        if (!cancelled && storefrontProducts.length > 0) {
          setProducts(storefrontProducts);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCurrencyChange = (currencyCode) => {
    setSelectedCurrencyCode(currencyCode);
  };

  const goals = [
    { title: "Muscle & Strength", description: "Heavy lifting support for power, size, and lean muscle.", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=900&auto=format&fit=crop" },
    { title: "Gain Mass", description: "High-calorie nutrition for serious size and strength phases.", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=900&auto=format&fit=crop" },
    { title: "Weight Loss", description: "Lean training essentials for cardio, fat burn, and definition.", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=900&auto=format&fit=crop" },
    { title: "Recovery", description: "Post-workout support for repair, hydration, and daily consistency.", img: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=900&auto=format&fit=crop" },
    { title: "Performance", description: "Pre-workout energy and endurance for high-output training.", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=900&auto=format&fit=crop" },
  ];

  const cartCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const wishlistCount = wishlist.length;
  const navSearchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!isSearchOpen || !query) return [];

    return products
      .filter((product) => {
        const searchable = `${product.name} ${product.category} ${product.description}`.toLowerCase();
        return searchable.includes(query);
      })
      .slice(0, 6);
  }, [isSearchOpen, products, searchQuery]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const closeAccountModal = () => {
    setIsAccountModalOpen(false);
    setAccountModalMode("login");
    setAccountLoginForm({ identifier: "", password: "" });
    setAccountRegisterForm({
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    });
    setAccountFormErrors({});
    setAccountStatus("");
    setIsAccountSubmitting(false);
  };

  const openAccountModal = () => {
    closeSearch();
    setIsGoalsMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsAccountDropdownOpen(false);
    setIsAccountModalOpen(true);
    setAccountModalMode("login");
    setAccountFormErrors({});
    setAccountStatus("");
  };

  const switchAccountModalMode = (mode) => {
    setAccountModalMode(mode);
    setAccountFormErrors({});
    setAccountStatus("");
  };

  const handleAccountLoginSubmit = async (event) => {
    event.preventDefault();
    setIsAccountSubmitting(true);
    setAccountStatus("");

    const identifier = accountLoginForm.identifier.trim();
    const nextErrors = {};
    if (!identifier) nextErrors.identifier = "Enter your email address or mobile number.";
    if (!accountLoginForm.password.trim()) nextErrors.password = "Enter your password.";

    setAccountFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setIsAccountSubmitting(false);
      return;
    }

    try {
      const normalizedIdentifier = identifier.includes("@")
        ? normalizeAccountEmail(identifier)
        : normalizeAccountMobile(identifier);
      const user = readAccountUsers().find(
        (accountUser) =>
          accountUser.email === normalizedIdentifier ||
          accountUser.mobile === normalizedIdentifier,
      );

      if (!user) {
        setAccountFormErrors({ identifier: "No account found with this email or mobile number." });
        setIsAccountSubmitting(false);
        return;
      }

      const passwordHash = await hashAccountPassword(accountLoginForm.password, user.passwordSalt);
      if (passwordHash !== user.passwordHash) {
        setAccountFormErrors({ password: "Password is incorrect." });
        setIsAccountSubmitting(false);
        return;
      }

      setAccountSession(writeAccountSession(user));
      dispatchAccountSessionChange();
      closeAccountModal();
    } catch (error) {
      setAccountStatus(error.message || "Unable to login right now.");
    } finally {
      setIsAccountSubmitting(false);
    }
  };

  const handleAccountRegisterSubmit = async (event) => {
    event.preventDefault();
    setIsAccountSubmitting(true);
    setAccountStatus("");

    const fullName = accountRegisterForm.fullName.trim();
    const emailAddress = normalizeAccountEmail(accountRegisterForm.email);
    const mobileNumber = normalizeAccountMobile(accountRegisterForm.mobile);
    const nextErrors = {};

    if (!fullName) nextErrors.fullName = "Enter your full name.";
    if (!emailAddress) {
      nextErrors.email = "Enter your email address.";
    } else if (!accountEmailPattern.test(emailAddress)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!mobileNumber) {
      nextErrors.mobile = "Enter your mobile number.";
    } else if (!accountMobilePattern.test(mobileNumber)) {
      nextErrors.mobile = "Enter a valid 10 digit mobile number.";
    }
    if (!accountRegisterForm.password.trim()) {
      nextErrors.registerPassword = "Create a password.";
    } else if (accountRegisterForm.password.length < 6) {
      nextErrors.registerPassword = "Password must be at least 6 characters.";
    }
    if (!accountRegisterForm.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (accountRegisterForm.password !== accountRegisterForm.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    const users = readAccountUsers();
    if (users.some((user) => user.email === emailAddress)) {
      nextErrors.email = "An account with this email already exists.";
    }
    if (users.some((user) => user.mobile === mobileNumber)) {
      nextErrors.mobile = "An account with this mobile number already exists.";
    }

    setAccountFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setIsAccountSubmitting(false);
      return;
    }

    try {
      const passwordSalt = createAccountSalt();
      const passwordHash = await hashAccountPassword(accountRegisterForm.password, passwordSalt);
      const user = {
        id: `athleev-${Date.now()}`,
        fullName,
        email: emailAddress,
        mobile: mobileNumber,
        passwordSalt,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      saveAccountUsers([...users, user]);
      setAccountSession(writeAccountSession(user));
      dispatchAccountSessionChange();
      closeAccountModal();
    } catch (error) {
      setAccountStatus(error.message || "Unable to create account right now.");
    } finally {
      setIsAccountSubmitting(false);
    }
  };

  const handleAccountLogout = () => {
    clearAccountSession();
    setAccountSession(null);
    setIsAccountDropdownOpen(false);
    dispatchAccountSessionChange();
    window.history.pushState({}, "", "/my-account");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const getTotalInINR = () => {
    return cart.reduce((sum, item) => sum + item.basePrice * (item.qty || 1), 0);
  };

  const addToCart = (product) => {
    if (product.availableForSale === false || product.maxQuantity === 0) return;

    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        if (product.maxQuantity !== null && product.maxQuantity !== undefined && (existing.qty || 1) >= product.maxQuantity) {
          return currentCart;
        }
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      }
      return [...currentCart, { ...product, qty: 1 }];
    });

    if (product.source === "shopify") {
      addShopifyCartItem(product.variantId, 1).catch(() => {});
    }
  };

  const toggleWishlist = (product) => {
    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some((item) => item.id === product.id);
      return exists
        ? currentWishlist.filter((item) => item.id !== product.id)
        : [...currentWishlist, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((currentWishlist) => currentWishlist.filter((item) => item.id !== productId));
  };

  const removeFromCart = (productId) => {
    const product = cart.find((item) => item.id === productId);
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));

    if (product?.source === "shopify") {
      setShopifyCartItemQuantity(product.variantId, 0).catch(() => {});
    }
  };

  const increaseQty = (productId) => {
    const product = cart.find((item) => item.id === productId);
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId &&
        (item.maxQuantity === null || item.maxQuantity === undefined || (item.qty || 1) < item.maxQuantity)
          ? { ...item, qty: (item.qty || 1) + 1 }
          : item
      )
    );

    if (product?.source === "shopify") {
      addShopifyCartItem(product.variantId, 1).catch(() => {});
    }
  };

  const decreaseQty = (productId) => {
    const product = cart.find((item) => item.id === productId);
    const nextQuantity = Math.max((product?.qty || 1) - 1, 0);
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, qty: (item.qty || 1) - 1 } : item
        )
        .filter((item) => (item.qty || 0) > 0)
    );

    if (product?.source === "shopify") {
      setShopifyCartItemQuantity(product.variantId, nextQuantity).catch(() => {});
    }
  };

  const handleSubscribe = () => {
    if (!email.trim()) {
      setNewsletterStatus("Please enter your email address.");
      return;
    }
    setNewsletterStatus("Subscribed successfully.");
    setEmail("");
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen overflow-x-hidden bg-black font-sans text-white">
        <div className="flex flex-col items-center justify-between gap-3 bg-[#c69a4b] px-4 py-3 text-center text-xs text-white sm:text-sm md:flex-row md:px-8 md:text-left">
          <p>Contact +084 123 - 456 88</p>
          <p>Free gift when you spend over $150</p>
          <div className="flex max-w-full items-center gap-3">
            <span className="hidden md:inline">Currency</span>
            <select
              value={selectedCurrencyCode}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="max-w-[min(82vw,230px)] rounded border border-white bg-[#c69a4b] px-3 py-1 text-white outline-none"
              aria-label="Select currency"
            >
              {currencyOptions.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <nav
          ref={navRef}
          onMouseLeave={() => setIsGoalsMenuOpen(false)}
          className="sticky top-0 z-40 flex min-h-[76px] min-w-0 items-center justify-between gap-3 border-b border-[#c69a4b]/20 bg-[#111111]/95 px-3 py-3 shadow-2xl shadow-black/30 backdrop-blur sm:px-5 md:min-h-[82px] md:px-8"
        >
          <Link to="/" className="flex h-12 shrink-0 items-center overflow-hidden md:h-14" aria-label="Athleev home">
            <img src={logo} alt="Athleev Nutrition logo" fetchPriority="high" decoding="async" className="max-h-full w-auto object-contain" />
          </Link>
          <ul className="hidden items-center gap-6 font-medium lg:gap-8 md:flex">
            <li>
              <Link to="/" onClick={() => setIsGoalsMenuOpen(false)} className="transition hover:text-[#c69a4b]">HOME</Link>
            </li>
            <li>
              <button
                type="button"
                onMouseEnter={() => {
                  if (!isSearchOpen) setIsGoalsMenuOpen(true);
                }}
                onClick={() => {
                  closeSearch();
                  setIsGoalsMenuOpen((value) => !value);
                }}
                className={`inline-flex h-10 items-center gap-2 whitespace-nowrap uppercase tracking-[0.08em] transition hover:text-[#c69a4b] ${isGoalsMenuOpen ? "text-[#c69a4b]" : ""}`}
                aria-expanded={isGoalsMenuOpen}
                aria-controls="products-by-goals-menu"
              >
                PRODUCTS BY GOALS
                <span className={`inline-flex translate-y-px text-xs leading-none transition-transform duration-200 ${isGoalsMenuOpen ? "rotate-180" : ""}`} aria-hidden="true">
                  &#9662;
                </span>
              </button>
            </li>
            <li>
              <Link to="/shop" onClick={() => setIsGoalsMenuOpen(false)} className="transition hover:text-[#c69a4b]">SHOP</Link>
            </li>
            <li>
              <Link to="/our-story" onClick={() => setIsGoalsMenuOpen(false)} className="transition hover:text-[#c69a4b]">OUR STORY</Link>
            </li>
            <li>
              <Link to="/Athletes" onClick={() => setIsGoalsMenuOpen(false)} className="transition hover:text-[#c69a4b]">ATHLETES</Link>
            </li>
          </ul>
          <div className="flex min-w-0 items-center gap-2 text-xl sm:gap-3">
            <div className="relative min-w-0">
              {isSearchOpen ? (
                <div className="flex h-11 w-[min(68vw,270px)] items-center gap-2 rounded-full border border-[#c69a4b]/70 bg-black px-3 text-sm shadow-[0_0_24px_rgba(198,154,75,0.18)] transition-all duration-300 sm:w-[330px] sm:gap-3 sm:px-4 md:w-[390px]">
                  <span className="text-[#c69a4b]" aria-hidden="true">
                    <SearchIcon />
                  </span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search supplements..."
                    className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-gray-500"
                    aria-label="Search products"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="grid h-7 w-7 place-items-center rounded-full text-base font-black text-[#c69a4b] transition hover:bg-[#c69a4b] hover:text-black"
                    aria-label="Close search"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsGoalsMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#c69a4b]/40 bg-black text-[#c69a4b] shadow-lg shadow-[#c69a4b]/10 transition hover:-translate-y-0.5 hover:border-[#c69a4b] hover:bg-[#c69a4b] hover:text-black"
                  aria-label="Open search"
                >
                  <SearchIcon />
                </button>
              )}

              {isSearchOpen && (
                <div className="fixed left-3 right-3 top-[136px] z-50 max-h-[65vh] overflow-y-auto rounded-3xl border border-[#c69a4b]/50 bg-[#111111] p-3 shadow-2xl shadow-black sm:absolute sm:left-auto sm:right-0 sm:top-14 sm:w-[min(92vw,430px)]">
                  {searchQuery.trim() === "" ? (
                    <div className="px-3 py-6 text-center text-sm text-gray-400">
                      Search supplements, proteins, creatine...
                    </div>
                  ) : navSearchResults.length === 0 ? (
                    <div className="px-3 py-6 text-center">
                      <p className="font-bold text-white">No products found</p>
                      <p className="mt-1 text-sm text-gray-500">Try protein, creatine, BCAA, or recovery.</p>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {navSearchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={getProductPath(product)}
                          onClick={closeSearch}
                          className="flex min-w-0 items-center gap-3 rounded-2xl border border-transparent p-2 transition hover:border-[#c69a4b]/50 hover:bg-black"
                        >
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f8f6f1] p-2">
                            <img src={product.img} alt={product.name} decoding="async" className="h-full w-full object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black text-white">{product.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">{product.category}</p>
                          </div>
                          <span className="shrink-0 text-sm font-black text-[#c69a4b]">
                            {formatPrice(product.basePrice, selectedCurrency)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link
              to="/wishlist"
              onClick={() => setIsGoalsMenuOpen(false)}
              className={`${isSearchOpen ? "hidden sm:grid" : "grid"} relative h-11 w-11 place-items-center rounded-full border border-[#c69a4b]/40 bg-black text-[#c69a4b] transition hover:-translate-y-0.5 hover:border-[#c69a4b] hover:bg-[#c69a4b] hover:text-black`}
              aria-label={`Wishlist${wishlistCount > 0 ? ` with ${wishlistCount} items` : ""}`}
            >
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#c69a4b] px-1 text-[10px] font-black text-black">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsGoalsMenuOpen(false)}
              className={`${isSearchOpen ? "hidden sm:grid" : "grid"} relative h-11 w-11 place-items-center rounded-full border border-[#c69a4b]/40 bg-black text-[#c69a4b] transition hover:-translate-y-0.5 hover:border-[#c69a4b] hover:bg-[#c69a4b] hover:text-black`}
              aria-label={`Cart${cartCount > 0 ? ` with ${cartCount} items` : ""}`}
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#c69a4b] px-1 text-[10px] font-black text-black">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className={`${isSearchOpen ? "hidden sm:block" : "block"} relative`}>
              {accountSession ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsGoalsMenuOpen(false);
                    setIsAccountDropdownOpen((value) => !value);
                  }}
                  className="flex h-11 max-w-[180px] items-center gap-2 rounded-full border border-[#c69a4b]/50 bg-black px-3 text-left text-[#c69a4b] shadow-lg shadow-[#c69a4b]/10 transition hover:-translate-y-0.5 hover:border-[#c69a4b] hover:bg-[#17120a]"
                  aria-expanded={isAccountDropdownOpen}
                  aria-haspopup="menu"
                  aria-label="Open account menu"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#c69a4b] text-black">
                    <UserIcon />
                  </span>
                  <span className="hidden min-w-0 leading-tight lg:block">
                    <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">
                      Hello
                    </span>
                    <span className="block truncate text-xs font-black text-white">
                      {accountSession.fullName || accountSession.mobile}
                    </span>
                  </span>
                  <span className={`hidden text-xs transition-transform lg:inline ${isAccountDropdownOpen ? "rotate-180" : ""}`} aria-hidden="true">
                    &#9662;
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openAccountModal}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#c69a4b]/50 bg-black text-[#c69a4b] shadow-lg shadow-[#c69a4b]/10 transition hover:-translate-y-0.5 hover:border-[#c69a4b] hover:bg-[#c69a4b] hover:text-black"
                  aria-label="Login or signup"
                  title="Login or signup"
                >
                  <UserIcon />
                </button>
              )}

              {accountSession && isAccountDropdownOpen && (
                <div
                  className="absolute right-0 top-14 z-50 w-[min(86vw,280px)] overflow-hidden rounded-3xl border border-[#c69a4b]/40 bg-[#111111] p-2 text-sm shadow-2xl shadow-black"
                  role="menu"
                >
                  <div className="border-b border-[#c69a4b]/15 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c69a4b]">
                      Athleev Account
                    </p>
                    <p className="mt-2 font-black text-white">{accountSession.fullName}</p>
                    <p className="mt-1 text-xs text-gray-400">{accountSession.email}</p>
                  </div>
                  {[
                    { label: "My Profile", to: "/my-account" },
                    { label: "My Orders", to: "/my-orders" },
                    { label: "My Address", to: "/my-address" },
                    { label: "Refer & Earn", to: "/refer-earn" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setIsAccountDropdownOpen(false)}
                      className="block rounded-2xl px-4 py-3 font-semibold text-gray-300 transition hover:bg-black hover:text-[#c69a4b]"
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={handleAccountLogout}
                    className="mt-1 w-full rounded-2xl px-4 py-3 text-left font-black text-[#c69a4b] transition hover:bg-black"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen((value) => !value);
                setIsGoalsMenuOpen(false);
                closeSearch();
              }}
              className={`${isSearchOpen ? "hidden" : "grid"} h-11 w-11 place-items-center rounded-full border border-[#c69a4b]/40 bg-black text-[#c69a4b] transition hover:bg-[#c69a4b] hover:text-black md:hidden`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <MenuIcon />
            </button>
          </div>

          <div
            id="products-by-goals-menu"
            className={`absolute left-0 right-0 top-full hidden border-t border-[#c69a4b]/20 bg-black text-white shadow-[0_16px_28px_rgba(0,0,0,0.48)] transition-all duration-200 md:block ${
              isGoalsMenuOpen
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-2 pointer-events-none opacity-0"
            }`}
          >
            <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8 px-10 py-6 lg:px-16">
              {productsByGoals.map((goal) => (
                <section key={goal.id} className="min-w-0">
                  <h2 className="mb-4 text-sm font-black uppercase tracking-[0.08em] text-[#c69a4b]">
                    {goal.title}
                  </h2>
                  <div className="grid gap-2.5">
                    {goal.products.map((product) => (
                      <Link
                        key={product.label}
                        to={`/${goal.id}/${product.slug}`}
                        onClick={() => setIsGoalsMenuOpen(false)}
                        className="text-sm leading-6 text-white transition hover:text-[#c69a4b]"
                      >
                        {product.label}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </nav>

        {isAccountModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm">
            <div
              className="w-full max-w-md animate-[fadeIn_0.2s_ease-out] overflow-hidden rounded-[32px] border border-[#c69a4b]/45 bg-[#111111] text-white shadow-2xl shadow-black"
              role="dialog"
              aria-modal="true"
              aria-labelledby="account-login-title"
            >
              <div className="flex items-start justify-between gap-5 border-b border-[#c69a4b]/20 p-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#c69a4b]">
                    Athleev Account
                  </p>
                  <h2 id="account-login-title" className="mt-2 text-3xl font-black">
                    {accountModalMode === "login" ? "Login" : "Create Account"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeAccountModal}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#c69a4b]/35 bg-black text-xl font-black text-[#c69a4b] transition hover:bg-[#c69a4b] hover:text-black"
                  aria-label="Close account login"
                >
                  ×
                </button>
              </div>

              {accountModalMode === "login" ? (
                <form className="grid gap-5 p-6" onSubmit={handleAccountLoginSubmit}>
                  <label htmlFor="account-login-identifier" className="block">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">
                      Email Address or Mobile Number
                    </span>
                    <input
                      id="account-login-identifier"
                      type="text"
                      value={accountLoginForm.identifier}
                      onChange={(event) => {
                        setAccountLoginForm((form) => ({
                          ...form,
                          identifier: event.target.value,
                        }));
                        setAccountFormErrors({});
                        setAccountStatus("");
                      }}
                      placeholder="you@example.com or 9876543210"
                      autoComplete="username"
                      className="mt-2 w-full rounded-full border border-gray-700 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#c69a4b] focus:shadow-[0_0_24px_rgba(198,154,75,0.12)]"
                      aria-invalid={accountFormErrors.identifier ? "true" : "false"}
                    />
                    {accountFormErrors.identifier && (
                      <p className="mt-2 text-sm font-semibold text-red-300">
                        {accountFormErrors.identifier}
                      </p>
                    )}
                  </label>

                  <label htmlFor="account-login-password" className="block">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">
                      Password
                    </span>
                    <input
                      id="account-login-password"
                      type="password"
                      value={accountLoginForm.password}
                      onChange={(event) => {
                        setAccountLoginForm((form) => ({
                          ...form,
                          password: event.target.value,
                        }));
                        setAccountFormErrors({});
                        setAccountStatus("");
                      }}
                      placeholder="Enter password"
                      autoComplete="current-password"
                      className="mt-2 w-full rounded-full border border-gray-700 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#c69a4b] focus:shadow-[0_0_24px_rgba(198,154,75,0.12)]"
                      aria-invalid={accountFormErrors.password ? "true" : "false"}
                    />
                    {accountFormErrors.password && (
                      <p className="mt-2 text-sm font-semibold text-red-300">
                        {accountFormErrors.password}
                      </p>
                    )}
                  </label>

                  {accountStatus && (
                    <p className="rounded-2xl border border-[#c69a4b]/30 bg-[#17120a] p-3 text-sm font-semibold text-gray-200">
                      {accountStatus}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isAccountSubmitting}
                    className="ath-btn-primary w-full px-6 py-4 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-300 disabled:shadow-none"
                  >
                    {isAccountSubmitting ? "Logging In..." : "Login"}
                  </button>

                  <button
                    type="button"
                    onClick={() => switchAccountModalMode("register")}
                    className="text-sm font-semibold text-[#c69a4b] transition hover:text-[#d4b16f]"
                  >
                    Create Account
                  </button>
                </form>
              ) : (
                <form className="grid max-h-[72vh] gap-4 overflow-y-auto p-6" onSubmit={handleAccountRegisterSubmit}>
                  <label htmlFor="account-register-name" className="block">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">
                      Full Name
                    </span>
                    <input
                      id="account-register-name"
                      type="text"
                      value={accountRegisterForm.fullName}
                      onChange={(event) => {
                        setAccountRegisterForm((form) => ({
                          ...form,
                          fullName: event.target.value,
                        }));
                        setAccountFormErrors({});
                      }}
                      placeholder="Your full name"
                      autoComplete="name"
                      className="mt-2 w-full rounded-full border border-gray-700 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#c69a4b] focus:shadow-[0_0_24px_rgba(198,154,75,0.12)]"
                    />
                    {accountFormErrors.fullName && (
                      <p className="mt-2 text-sm font-semibold text-red-300">
                        {accountFormErrors.fullName}
                      </p>
                    )}
                  </label>

                  <label htmlFor="account-register-email" className="block">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">
                      Email Address
                    </span>
                    <input
                      id="account-register-email"
                      type="email"
                      value={accountRegisterForm.email}
                      onChange={(event) => {
                        setAccountRegisterForm((form) => ({
                          ...form,
                          email: event.target.value,
                        }));
                        setAccountFormErrors({});
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="mt-2 w-full rounded-full border border-gray-700 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#c69a4b] focus:shadow-[0_0_24px_rgba(198,154,75,0.12)]"
                    />
                    {accountFormErrors.email && (
                      <p className="mt-2 text-sm font-semibold text-red-300">
                        {accountFormErrors.email}
                      </p>
                    )}
                  </label>

                  <label htmlFor="account-register-mobile" className="block">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">
                      Mobile Number
                    </span>
                    <input
                      id="account-register-mobile"
                      type="tel"
                      inputMode="numeric"
                      value={accountRegisterForm.mobile}
                      onChange={(event) => {
                        setAccountRegisterForm((form) => ({
                          ...form,
                          mobile: event.target.value.replace(/\D/g, "").slice(0, 10),
                        }));
                        setAccountFormErrors({});
                      }}
                      placeholder="9876543210"
                      autoComplete="tel"
                      className="mt-2 w-full rounded-full border border-gray-700 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#c69a4b] focus:shadow-[0_0_24px_rgba(198,154,75,0.12)]"
                    />
                    {accountFormErrors.mobile && (
                      <p className="mt-2 text-sm font-semibold text-red-300">
                        {accountFormErrors.mobile}
                      </p>
                    )}
                  </label>

                  <label htmlFor="account-register-password" className="block">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">
                      Password
                    </span>
                    <input
                      id="account-register-password"
                      type="password"
                      value={accountRegisterForm.password}
                      onChange={(event) => {
                        setAccountRegisterForm((form) => ({
                          ...form,
                          password: event.target.value,
                        }));
                        setAccountFormErrors({});
                      }}
                      placeholder="Create password"
                      autoComplete="new-password"
                      className="mt-2 w-full rounded-full border border-gray-700 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#c69a4b] focus:shadow-[0_0_24px_rgba(198,154,75,0.12)]"
                    />
                    {accountFormErrors.registerPassword && (
                      <p className="mt-2 text-sm font-semibold text-red-300">
                        {accountFormErrors.registerPassword}
                      </p>
                    )}
                  </label>

                  <label htmlFor="account-register-confirm-password" className="block">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">
                      Confirm Password
                    </span>
                    <input
                      id="account-register-confirm-password"
                      type="password"
                      value={accountRegisterForm.confirmPassword}
                      onChange={(event) => {
                        setAccountRegisterForm((form) => ({
                          ...form,
                          confirmPassword: event.target.value,
                        }));
                        setAccountFormErrors({});
                      }}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      className="mt-2 w-full rounded-full border border-gray-700 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#c69a4b] focus:shadow-[0_0_24px_rgba(198,154,75,0.12)]"
                    />
                    {accountFormErrors.confirmPassword && (
                      <p className="mt-2 text-sm font-semibold text-red-300">
                        {accountFormErrors.confirmPassword}
                      </p>
                    )}
                  </label>

                  {accountStatus && (
                    <p className="rounded-2xl border border-[#c69a4b]/30 bg-[#17120a] p-3 text-sm font-semibold text-gray-200">
                      {accountStatus}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isAccountSubmitting}
                    className="ath-btn-primary w-full px-6 py-4 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-300 disabled:shadow-none"
                  >
                    {isAccountSubmitting ? "Creating Account..." : "Register"}
                  </button>

                  <button
                    type="button"
                    onClick={() => switchAccountModalMode("login")}
                    className="text-sm font-semibold text-[#c69a4b] transition hover:text-[#d4b16f]"
                  >
                    Already have an account? Login
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="sticky top-[76px] z-30 max-h-[calc(100vh-76px)] overflow-y-auto border-b border-[#c69a4b]/20 bg-[#0b0b0b] px-4 py-5 shadow-2xl shadow-black sm:px-6 md:hidden">
            <div className="grid gap-4 font-bold">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-2xl border border-[#2f2f2f] px-4 py-3 transition hover:border-[#c69a4b] hover:text-[#c69a4b]"
              >
                HOME
              </Link>
              <button
                type="button"
                onClick={() => setIsGoalsMenuOpen((value) => !value)}
                className="flex items-center justify-between rounded-2xl border border-[#2f2f2f] px-4 py-3 text-left uppercase transition hover:border-[#c69a4b] hover:text-[#c69a4b]"
                aria-expanded={isGoalsMenuOpen}
                aria-controls="mobile-products-by-goals-menu"
              >
                PRODUCTS BY GOALS
                <span className={`text-xs transition-transform duration-200 ${isGoalsMenuOpen ? "rotate-180" : ""}`} aria-hidden="true">
                  &#9662;
                </span>
              </button>
              {isGoalsMenuOpen && (
                <div id="mobile-products-by-goals-menu" className="grid gap-6 rounded-2xl border border-[#c69a4b]/20 bg-black p-4 text-white shadow-lg shadow-black sm:grid-cols-2">
                  {productsByGoals.map((goal) => (
                    <section key={goal.id}>
                      <h2 className="mb-3 text-sm font-black uppercase text-[#c69a4b]">{goal.title}</h2>
                      <div className="grid gap-2.5">
                        {goal.products.map((product) => (
                          <Link
                            key={product.label}
                            to={`/${goal.id}/${product.slug}`}
                            onClick={() => {
                              setIsGoalsMenuOpen(false);
                              setIsMobileMenuOpen(false);
                            }}
                            className="text-sm text-white transition hover:text-[#c69a4b]"
                          >
                            {product.label}
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
              {[
                { to: "/shop", label: "SHOP" },
                { to: "/our-story", label: "OUR STORY" },
                { to: "/Athletes", label: "ATHLETES" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsGoalsMenuOpen(false);
                  }}
                  className="rounded-2xl border border-[#2f2f2f] px-4 py-3 transition hover:border-[#c69a4b] hover:text-[#c69a4b]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <Suspense fallback={<div className="min-h-[40vh] bg-black" />}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  addToCart={addToCart}
                  increaseQty={increaseQty}
                  decreaseQty={decreaseQty}
                  goals={goals}
                  products={products}
                  formatPrice={(value) => formatPrice(value, selectedCurrency)}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  cart={cart}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  products={products}
                  removeFromCart={removeFromCart}
                  increaseQty={increaseQty}
                  decreaseQty={decreaseQty}
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  formatPrice={(value) => formatPrice(value, selectedCurrency)}
                  selectedCurrency={selectedCurrency}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                <Checkout
                  cart={cart}
                  getTotalInINR={getTotalInINR}
                  formatPrice={(value) => formatPrice(value, selectedCurrency)}
                  selectedCurrency={selectedCurrency}
                />
              }
            />
            <Route
              path="/shop"
              element={
                <Shop
                  products={products}
                  cart={cart}
                  addToCart={addToCart}
                  increaseQty={increaseQty}
                  decreaseQty={decreaseQty}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  formatPrice={(value) => formatPrice(value, selectedCurrency)}
                />
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductPage
                  products={products}
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  formatPrice={(value) => formatPrice(value, selectedCurrency)}
                />
              }
            />
            <Route
              path="/:categorySlug/:productSlug"
              element={
                <ProductPage
                  products={products}
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  formatPrice={(value) => formatPrice(value, selectedCurrency)}
                />
              }
            />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/my-address" element={<MyAddress />} />
            <Route path="/refer-earn" element={<ReferEarn />} />
            <Route
              path="/wishlist"
              element={
                <Wishlist
                  wishlist={wishlist}
                  removeFromWishlist={removeFromWishlist}
                  addToCart={addToCart}
                  formatPrice={(value) => formatPrice(value, selectedCurrency)}
                />
              }
            />
            <Route
              path="/product-goals"
              element={
                <ProductGoals
                  products={products}
                  cart={cart}
                  addToCart={addToCart}
                  formatPrice={(value) => formatPrice(value, selectedCurrency)}
                />
              }
            />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/Athletes" element={<Athletes />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </Suspense>

        <footer className="bg-[#111111] border-t border-[#c69a4b]/20 px-5 py-14 sm:px-8 md:px-12 lg:px-20 md:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h2 className="text-3xl font-black text-[#c69a4b]">ATHLEEV</h2>
              <p className="text-gray-400 mt-4 leading-relaxed">
                Premium sports nutrition supplements designed for athletes, fitness lovers and bodybuilders.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {footerSocialLinks.map(({ label, href, icon: SocialIcon }) => (
                  href ? (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      title={label}
                      className="grid h-11 w-11 place-items-center rounded-full border border-[#c69a4b]/35 bg-black text-lg text-gray-300 shadow-lg shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c69a4b] hover:bg-[#c69a4b] hover:text-black hover:shadow-[#c69a4b]/20"
                    >
                      <SocialIcon aria-hidden="true" />
                    </a>
                  ) : (
                    <button
                      key={label}
                      type="button"
                      disabled
                      aria-label={`${label} profile unavailable`}
                      title={`${label} profile unavailable`}
                      className="grid h-11 w-11 cursor-not-allowed place-items-center rounded-full border border-[#c69a4b]/25 bg-black text-lg text-gray-500 shadow-lg shadow-black/25 opacity-75"
                    >
                      <SocialIcon aria-hidden="true" />
                    </button>
                  )
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-5 text-xl font-black uppercase tracking-[0.04em] text-white">Products</h3>
              <ul className="space-y-3 text-gray-400">
                {footerProductLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="block cursor-pointer transition hover:text-[#c69a4b]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-5 text-xl font-black uppercase tracking-[0.04em]">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                {footerQuickLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="block cursor-pointer transition hover:text-[#c69a4b]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-5 text-xl font-black uppercase tracking-[0.04em] text-white">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe & get exclusive offers and fitness updates.</p>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setNewsletterStatus("");
                  }}
                  className="px-4 py-3 rounded-full bg-black border border-gray-700 outline-none focus:border-[#c69a4b]"
                  aria-label="Newsletter email address"
                />
                <button
                  type="button"
                  onClick={handleSubscribe}
                  className="rounded-full bg-[#c69a4b] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-black shadow-lg shadow-[#c69a4b]/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b16f]"
                >
                  Subscribe
                </button>
                {newsletterStatus && (
                  <p className="rounded-2xl border border-[#c69a4b]/25 bg-black p-3 text-sm font-semibold text-gray-300">
                    {newsletterStatus}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-14 pt-8 flex justify-center items-center text-gray-500 text-center">
            <p>© 2026 Athleev Nutrition. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
