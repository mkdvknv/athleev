import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Cart({
  cart,
  products = [],
  removeFromCart,
  increaseQty,
  decreaseQty,
  addToCart,
  wishlist = [],
  toggleWishlist,
  formatPrice,
  selectedCurrency,
}) {
  const navigate = useNavigate();
  const cartTotalInINR = cart.reduce((sum, item) => sum + item.basePrice * (item.qty || 1), 0);
  const wishlistIds = new Set(wishlist.map((item) => item.id));

  const cartIds = new Set(cart.map((item) => item.id));
  const cartCategories = new Set(cart.map((item) => item.category));

  const sameCategoryProducts = products.filter(
    (product) => !cartIds.has(product.id) && cartCategories.has(product.category)
  );

  const otherProducts = products.filter(
    (product) => !cartIds.has(product.id) && !cartCategories.has(product.category)
  );

  const relatedProducts = [...sameCategoryProducts, ...otherProducts].slice(0, 4);

  useEffect(() => {
    document.title = "Cart | Athleev Nutrition";
  }, []);

  return (
    <section className="min-h-screen overflow-x-hidden bg-black px-5 py-14 text-white sm:px-6 md:px-12 lg:px-20">
      <div className="ath-section-container">
      <div className="mb-10 border-b border-[#c69a4b]/20 pb-8">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c69a4b]">Athleev Checkout</p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl">
          YOUR <span className="text-[#c69a4b]">CART</span>
        </h1>
        <p className="mt-4 max-w-2xl text-gray-400">
          Review your performance stack before moving to secure checkout.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="ath-premium-card border-[#c69a4b]/30 px-6 py-20 text-center">
          <p className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-[#c69a4b]/40 bg-black text-3xl text-[#c69a4b]">
            +
          </p>
          <h2 className="text-3xl font-black text-white">Your cart is empty</h2>
          <p className="mx-auto mt-3 max-w-md text-gray-400">
            Start with premium formulas for strength, recovery, and daily performance.
          </p>
          <Link
            to="/shop"
            className="ath-btn-primary mt-8"
          >
            Shop Products
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            {cart.map((item) => (
              <article
                key={item.id}
              className="ath-product-card grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
              >
                <div className="flex w-full min-w-0 flex-col items-center gap-5 sm:flex-row lg:w-auto">
                  <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-2xl border border-[#c69a4b]/30 bg-gradient-to-b from-[#f8f5ee] to-[#ded4c3] p-2 shadow-inner">
                    <img
                      src={item.img}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full scale-110 object-contain object-center drop-shadow-[0_12px_12px_rgba(0,0,0,0.22)]"
                    />
                  </div>
                  <div className="min-w-0 text-center sm:text-left">
                    <h2 className="break-words text-2xl font-black">{item.name}</h2>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">{item.category}</p>
                    <p className="mt-2 text-xl font-black text-[#c69a4b]">
                      {formatPrice(item.basePrice, selectedCurrency)}
                    </p>
                    <p className="mt-2 text-sm text-gray-400">Premium Gym Supplement</p>
                  </div>
                </div>

                <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between lg:w-auto lg:flex-col lg:items-end">
                  <div className="flex items-center overflow-hidden rounded-full border border-[#c69a4b]/70 bg-gradient-to-r from-[#080808] via-[#15120c] to-[#080808] p-1 shadow-[0_18px_45px_rgba(198,154,75,0.18)]">
                    <button
                      type="button"
                      onClick={() => decreaseQty(item.id)}
                      className="grid h-[52px] w-[52px] place-items-center rounded-full text-2xl font-black text-[#c69a4b] transition duration-200 hover:scale-105 hover:bg-[#c69a4b] hover:text-black active:scale-95"
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      -
                    </button>
                    <span className="grid h-[52px] min-w-[72px] place-items-center rounded-full border border-[#c69a4b]/30 bg-black/70 px-7 text-xl font-black text-white shadow-[0_0_18px_rgba(198,154,75,0.16)]">
                      {item.qty || 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => increaseQty(item.id)}
                      className="grid h-[52px] w-[52px] place-items-center rounded-full text-2xl font-black text-[#c69a4b] transition duration-200 hover:scale-105 hover:bg-[#c69a4b] hover:text-black active:scale-95"
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>

                  <div className="text-center sm:text-right">
                    <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Item Total</p>
                    <p className="mt-1 text-xl font-black text-[#c69a4b]">
                      {formatPrice(item.basePrice * (item.qty || 1), selectedCurrency)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="mt-3 rounded-full border border-red-500/70 px-5 py-2 text-xs font-black uppercase tracking-[0.12em] text-red-400 transition-all hover:-translate-y-0.5 hover:bg-red-500 hover:text-white"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="ath-premium-card h-fit border-[#c69a4b]/60 p-6 xl:sticky xl:top-28">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c69a4b]">Order Summary</p>
            <div className="mt-6 space-y-4 text-gray-300">
              <div className="flex justify-between gap-4">
                <span>Items</span>
                <span>{cart.reduce((sum, item) => sum + (item.qty || 1), 0)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Shipping</span>
                <span className="text-[#c69a4b]">Free</span>
              </div>
              <div className="border-t border-[#2f2f2f] pt-5">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-xl font-black text-white">Total</span>
                  <span className="text-3xl font-black text-[#c69a4b]">
                    {formatPrice(cartTotalInINR, selectedCurrency)}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="ath-btn-primary mt-7 w-full px-6 py-4"
            >
              Proceed To Checkout
            </button>
            <Link
              to="/shop"
              className="ath-btn-outline mt-4 block border-[#c69a4b]/70 text-center"
            >
              Continue Shopping
            </Link>
          </aside>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-3xl font-black">
                  YOU MAY <span className="text-[#c69a4b]">ALSO LIKE</span>
                </h2>
                <Link
                  to="/shop"
                  className="ath-btn-outline self-start sm:self-auto"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-8 grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="ath-product-card group relative flex h-full flex-col justify-between border-[#c69a4b] p-6"
                  >
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      className={`absolute right-8 top-8 z-10 h-10 w-10 rounded-full border text-lg font-black transition ${
                        wishlistIds.has(product.id)
                          ? "border-[#c69a4b] bg-[#c69a4b] text-black"
                          : "border-[#c69a4b] bg-black/80 text-[#c69a4b] hover:bg-[#c69a4b] hover:text-black"
                      }`}
                      aria-label={`${wishlistIds.has(product.id) ? "Remove" : "Add"} ${product.name} ${wishlistIds.has(product.id) ? "from" : "to"} wishlist`}
                    >
                      {wishlistIds.has(product.id) ? "♥" : "♡"}
                    </button>
                    <div>
                      <div className="flex h-[260px] items-center justify-center overflow-hidden rounded-3xl border border-[#eadfca] bg-[#f5f5f5] p-4 shadow-inner sm:h-[300px]">
                        <img
                          src={product.img}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full scale-110 object-contain object-center drop-shadow-[0_18px_18px_rgba(0,0,0,0.24)] transition-all duration-300 group-hover:scale-125"
                        />
                      </div>
                      <div className="mt-5">
                        <p className="text-xs uppercase tracking-[3px] text-gray-400">Recommended</p>
                        <h3 className="mt-3 text-xl font-black">{product.name}</h3>
                        <p className="mt-4 text-2xl font-black text-[#c69a4b]">
                          {formatPrice(product.basePrice, selectedCurrency)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      disabled={product.availableForSale === false}
                      className="ath-btn-primary mt-6 w-full px-5 py-3 disabled:cursor-not-allowed disabled:bg-gray-600"
                      aria-label={product.availableForSale === false ? `${product.name} is sold out` : `Add ${product.name} to cart`}
                    >
                      {product.availableForSale === false ? "Sold Out" : "Add To Cart"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </section>
  );
}
