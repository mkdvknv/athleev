import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const getProductPath = (product) =>
  product?.slug && product?.categorySlug
    ? `/${product.categorySlug}/${product.slug}`
    : `/product/${product.id}`;

export default function Shop({
  products = [],
  cart = [],
  addToCart,
  increaseQty,
  decreaseQty,
  wishlist = [],
  toggleWishlist,
  formatPrice,
}) {
  const [searchParams] = useSearchParams();
  const menuFilterKey = searchParams.toString();
  const selectedMenuProduct = searchParams.get("product") || "";
  const [editedFilters, setEditedFilters] = useState(() => ({
    key: menuFilterKey,
    category: "All",
    search: selectedMenuProduct,
  }));
  const hasNewMenuFilter = editedFilters.key !== menuFilterKey;
  const category = hasNewMenuFilter ? "All" : editedFilters.category;
  const search = hasNewMenuFilter ? selectedMenuProduct : editedFilters.search;
  const wishlistIds = new Set(wishlist.map((item) => item.id));
  const cartItemsById = new Map(cart.map((item) => [item.id, item]));

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category)))],
    [products]
  );

  const filtered = products.filter((product) => {
    const matchCategory = category === "All" || product.category === category;
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  useEffect(() => {
    document.title = "Shop Supplements | Athleev Nutrition";
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-black px-5 py-14 text-white sm:px-8 md:px-12 lg:px-20 lg:py-16">
      <section className="ath-section-container">
      <div className="mb-10 flex flex-col gap-5 border-b border-[#c69a4b]/20 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c69a4b]">
            Premium Nutrition
          </p>
          <h1 className="mt-4 text-3xl font-black sm:text-5xl">
            OUR <span className="text-[#c69a4b]">SHOP</span>
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
            Browse performance formulas built for strength, recovery, and daily consistency.
          </p>
        </div>
        <p className="w-fit rounded-full border border-[#c69a4b]/35 bg-[#111] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-gray-300">
          {filtered.length} Products
        </p>
      </div>

      <div className="ath-premium-card mb-12 rounded-[28px] border-[#c69a4b]/25 bg-[#0d0d0d] p-4 sm:p-5">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#c69a4b]" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setEditedFilters({
              key: menuFilterKey,
              category,
              search: e.target.value,
            })
          }
          className="w-full rounded-full border border-[#c69a4b]/35 bg-black px-12 py-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#c69a4b] focus:shadow-[0_0_24px_rgba(198,154,75,0.14)]"
          aria-label="Search products"
        />
        </div>
        <div className="hidden flex-wrap items-center gap-2 md:flex">
          {categories.map((categoryOption) => (
            <button
              key={categoryOption}
              type="button"
              onClick={() =>
                setEditedFilters({
                  key: menuFilterKey,
                  category: categoryOption,
                  search,
                })
              }
              className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em] transition ${
                category === categoryOption
                  ? "border-[#c69a4b] bg-[#c69a4b] text-black"
                  : "border-[#2f2f2f] bg-black text-gray-400 hover:border-[#c69a4b] hover:text-[#c69a4b]"
              }`}
              aria-pressed={category === categoryOption}
            >
              {categoryOption}
            </button>
          ))}
        </div>
        <select
          className="w-full rounded-full border border-[#c69a4b]/35 bg-black p-4 text-sm text-white outline-none md:hidden"
          value={category}
          aria-label="Filter products by category"
          onChange={(e) =>
            setEditedFilters({
              key: menuFilterKey,
              category: e.target.value,
              search,
            })
          }
        >
          {categories.map((categoryOption) => (
            <option key={categoryOption} value={categoryOption}>
              {categoryOption}
            </option>
          ))}
        </select>
      </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center text-gray-400 py-20">
            No products match your search.
          </div>
        ) : (
          filtered.map((product, index) => (
            <div
              key={product.id}
              className={`ath-product-card group relative flex h-full flex-col overflow-hidden ${cartItemsById.has(product.id) ? "border-[#c69a4b] shadow-[0_0_28px_rgba(198,154,75,0.18)]" : "border-[#c69a4b]/60"}`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className={`absolute right-4 top-4 z-10 h-11 w-11 rounded-full border text-xl font-black transition ${wishlistIds.has(product.id) ? "border-[#c69a4b] bg-[#c69a4b] text-black" : "border-[#c69a4b] bg-black/80 text-[#c69a4b] hover:bg-[#c69a4b] hover:text-black"}`}
                aria-label={`${wishlistIds.has(product.id) ? "Remove" : "Add"} ${product.name} ${wishlistIds.has(product.id) ? "from" : "to"} wishlist`}
              >
                {wishlistIds.has(product.id) ? "♥" : "♡"}
              </button>
              <div className="absolute left-4 top-4 z-10 rounded-full bg-[#c69a4b] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                {index < 4 ? "Bestseller" : "Premium"}
              </div>
              <Link to={getProductPath(product)} className="m-3 mb-0 flex h-[290px] items-center justify-center overflow-hidden rounded-3xl border border-[#c69a4b]/35 bg-gradient-to-b from-[#f8f5ee] to-[#ded4c3] p-0 shadow-[inset_0_1px_10px_rgba(0,0,0,0.08),0_12px_28px_rgba(0,0,0,0.18)] sm:h-[315px] lg:h-[300px] xl:h-[315px]" aria-label={`View ${product.name} product details`}>
                <img
                  src={product.img}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full scale-[1.28] object-contain object-center drop-shadow-[0_22px_22px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-out group-hover:scale-[1.38] sm:scale-[1.4] sm:group-hover:scale-[1.52]"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <p className="text-xs uppercase tracking-[3px] text-gray-400">{product.category}</p>
                  <h2 className="mt-3 text-xl font-black leading-tight">
                    <Link to={getProductPath(product)} className="transition hover:text-[#c69a4b]">
                      {product.name}
                    </Link>
                  </h2>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm tracking-[0.12em] text-[#c69a4b]">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                    <span className="text-xs font-bold text-gray-500">{product.rating || 4.8}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-2xl font-black text-[#c69a4b]">{formatPrice(product.basePrice)}</p>
                  {cartItemsById.has(product.id) ? (
                    <div className="mt-5 rounded-[28px] border border-[#c69a4b]/80 bg-white/[0.04] p-2.5 shadow-[0_18px_45px_rgba(198,154,75,0.18)] backdrop-blur">
                      <div className="mb-2.5 text-center text-[11px] font-black uppercase tracking-[0.28em] text-[#d4b16f]">
                        Added to Cart
                      </div>
                      <div className="flex items-center justify-between overflow-hidden rounded-full border border-[#c69a4b]/40 bg-gradient-to-r from-[#080808] via-[#15120c] to-[#080808] p-1 shadow-inner shadow-black">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            decreaseQty(product.id);
                          }}
                          className="grid h-12 w-12 place-items-center rounded-full text-2xl font-black text-[#c69a4b] transition duration-200 hover:scale-105 hover:bg-[#c69a4b] hover:text-black active:scale-95"
                          aria-label={`Decrease ${product.name} quantity`}
                        >
                          -
                        </button>
                        <span className="grid h-12 min-w-16 place-items-center rounded-full border border-[#c69a4b]/30 bg-black/70 px-5 text-lg font-black text-white shadow-[0_0_18px_rgba(198,154,75,0.16)]">
                          {cartItemsById.get(product.id)?.qty || 1}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            increaseQty(product.id);
                          }}
                          className="grid h-12 w-12 place-items-center rounded-full text-2xl font-black text-[#c69a4b] transition duration-200 hover:scale-105 hover:bg-[#c69a4b] hover:text-black active:scale-95"
                          aria-label={`Increase ${product.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={product.availableForSale === false}
                      className="ath-btn-primary mt-5 w-full px-5 py-3 disabled:cursor-not-allowed disabled:bg-gray-600"
                    >
                      {product.availableForSale === false ? "Sold Out" : "Add To Cart"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      </section>
    </div>
  );
}

