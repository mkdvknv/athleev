import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Wishlist({ wishlist = [], removeFromWishlist, addToCart, formatPrice }) {
  useEffect(() => {
    document.title = "Wishlist | Athleev Nutrition";
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black px-5 py-14 text-white sm:px-6 md:px-12 lg:px-20 lg:py-16">
      <section className="ath-section-container">
        <div className="mb-10 flex flex-col gap-5 border-b border-[#c69a4b]/20 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#c69a4b]">
              Saved Products
            </p>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl md:text-6xl">
              Your <span className="text-[#c69a4b]">Wishlist</span>
            </h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
              Keep your favorite Athleev formulas ready for your next performance stack.
            </p>
          </div>
          <Link
            to="/shop"
            className="ath-btn-outline self-start md:self-auto"
          >
            Continue Shopping
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="ath-premium-card border-[#c69a4b]/30 px-6 py-20 text-center">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-[#c69a4b]/40 bg-black text-3xl font-black text-[#c69a4b]">
              ♥
            </div>
            <h2 className="text-3xl font-black text-white">Your wishlist is empty</h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-gray-400">
              Save your favorite supplements and come back when you are ready to build your stack.
            </p>
            <Link
              to="/shop"
              className="ath-btn-primary mt-8"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid min-w-0 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((product) => (
              <article
                key={product.id}
                className="ath-product-card group relative flex h-full flex-col overflow-hidden p-5"
              >
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute right-8 top-8 z-10 h-10 w-10 rounded-full border border-red-500/70 bg-black/85 text-lg font-black text-red-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:text-white"
                  aria-label={`Remove ${product.name} from wishlist`}
                  title="Remove from wishlist"
                >
                  ×
                </button>
                <div className="flex h-[275px] items-center justify-center overflow-hidden rounded-3xl border border-[#c69a4b]/35 bg-gradient-to-b from-[#f8f5ee] to-[#ded4c3] p-0 shadow-[inset_0_1px_10px_rgba(0,0,0,0.08),0_12px_28px_rgba(0,0,0,0.18)] sm:h-[305px] lg:h-[295px] xl:h-[310px]">
                  <img
                    src={product.img}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full scale-[1.28] object-contain object-center drop-shadow-[0_22px_22px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-out group-hover:scale-[1.42]"
                  />
                </div>
                <div className="mt-5 flex flex-1 flex-col">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-500">{product.category}</p>
                  <h2 className="mt-3 text-xl font-black leading-tight">{product.name}</h2>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm tracking-[0.12em] text-[#c69a4b]">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                    <span className="text-xs font-bold text-gray-500">{product.rating || 4.8}</span>
                  </div>
                  <p className="mt-4 text-2xl font-black text-[#c69a4b]">
                    {formatPrice(product.basePrice)}
                  </p>
                  <div className="mt-auto grid gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      disabled={product.availableForSale === false}
                      className="ath-btn-primary w-full px-5 py-3 disabled:cursor-not-allowed disabled:bg-gray-600"
                      aria-label={product.availableForSale === false ? `${product.name} is sold out` : `Add ${product.name} to cart`}
                    >
                      {product.availableForSale === false ? "Sold Out" : "Add To Cart"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      className="rounded-full border border-red-500/70 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-red-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:text-white"
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      Remove From Wishlist
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
