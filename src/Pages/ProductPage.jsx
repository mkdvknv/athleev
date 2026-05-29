import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const menuSlugProductNames = {
  "athleev-akg": "AKG",
  "athleev-beta-alanine": "Beta Alanine",
  "athleev-whey-protein": "Whey Protein",
  "athleev-mass-gainer": "Mass Gainer",
  "athleev-creatine": "Creatine",
  "athleev-glutamine": "L-Glutamine",
  "athleev-l-glutamine": "L-Glutamine",
  "athleev-pre-workout": "Pre Workout",
  "athleev-post-workout": "Post Workout",
  "athleev-eaa": "EAA",
  "athleev-bcaa": "BCAA",
  "athleev-whey-isolate": "Isolate Protein",
  "athleev-multivitamin": "Multivitamin For Men",
  "athleev-omega-3-fish-oil": "Omega 3 Fish Oil",
  "athleev-testosterone-booster": "Testosterone Booster",
};

const normalise = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export default function ProductPage({ products = [], addToCart, wishlist = [], toggleWishlist, formatPrice }) {
  const { id, categorySlug, productSlug } = useParams();
  const slugProductName = menuSlugProductNames[productSlug];
  const product = products.find((item) => {
    if (id) return String(item.id) === String(id);
    if (productSlug && item.slug === productSlug) {
      return !categorySlug || !item.categorySlug || item.categorySlug === categorySlug;
    }
    if (!slugProductName) return false;
    const productName = normalise(item.name).replace(/^athleev /, "");
    return productName === normalise(slugProductName);
  });
  const wishlistIds = new Set(wishlist.map((item) => item.id));

  const initialImage = product?.img ?? "";

  const [selectedImageChoice, setSelectedImageChoice] = useState(null);
  const [selectedOptionsChoice, setSelectedOptionsChoice] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeDetailsPanel, setActiveDetailsPanel] = useState("ingredients");

  const selectedImage =
    selectedImageChoice?.productId === product?.id ? selectedImageChoice.src : initialImage;
  const variants = useMemo(() => {
    if (product?.variants?.length) return product.variants;
    return product
      ? [{
          id: product.id,
          title: product.name,
          basePrice: product.basePrice,
          mrp: product.mrp,
          availableForSale: product.availableForSale !== false,
          maxQuantity: product.maxQuantity ?? null,
          selectedOptions: [],
        }]
      : [];
  }, [product]);
  const defaultVariant =
    variants.find((variant) => variant.availableForSale) || variants[0];
  const defaultSelections = Object.fromEntries(
    (defaultVariant?.selectedOptions || []).map((option) => [option.name, option.value])
  );
  const selections =
    selectedOptionsChoice?.productId === product?.id
      ? selectedOptionsChoice.values
      : defaultSelections;
  const selectedVariant =
    variants.find((variant) =>
      variant.selectedOptions.every((option) => selections[option.name] === option.value)
    ) || defaultVariant;
  const optionGroups = product?.options || [];
  const basePrice = selectedVariant?.basePrice ?? product?.basePrice ?? 0;
  const maximumQuantity = selectedVariant?.maxQuantity;
  const canPurchase =
    selectedVariant?.availableForSale !== false &&
    (maximumQuantity === null || maximumQuantity === undefined || maximumQuantity > 0);
  const selectedQuantity =
    maximumQuantity === null || maximumQuantity === undefined
      ? quantity
      : Math.max(1, Math.min(quantity, maximumQuantity || 1));

  const totalAmount = useMemo(() => basePrice * selectedQuantity, [basePrice, selectedQuantity]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    return product.images?.length ? product.images : [product.img];
  }, [product]);

  const relatedProducts = useMemo(
    () => products.filter((item) => item.id !== product?.id).slice(0, 4),
    [products, product]
  );

  const overviewPoints = [
    "Clinically-inspired formula for next-level workouts.",
    "Fast-absorbing nutrients to fuel strength and recovery.",
    "Premium ingredients sourced for athletes and bodybuilders.",
  ];

  const ingredients = [
    "Whey isolate protein",
    "BCAAs and EAAs",
    "Creatine monohydrate",
    "Beta alanine",
    "Vitamin B complex",
    "Natural flavours and sweeteners",
  ];

  const faqItems = [
    {
      question: "How soon will I see results?",
      answer:
        "Results depend on your training program and nutrition, but most athletes notice performance improvement within 2-3 weeks.",
    },
    {
      question: "Is this product suitable for beginners?",
      answer:
        "Yes. This formula supports beginners and experienced athletes with clean nutrients for workout recovery.",
    },
    {
      question: "Can I stack this with other supplements?",
      answer:
        "Absolutely. It pairs well with pre-workout, creatine, and recovery blends for a complete regimen.",
    },
  ];

  useEffect(() => {
    document.title = product
      ? `${product.name} | Athleev Nutrition`
      : "Product Not Found | Athleev Nutrition";
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-black px-5 py-16 text-white sm:px-6 md:px-12 lg:px-20">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Product not found</h1>
          <p className="text-gray-400">Please return to the shop and select another product.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant || !canPurchase) return;

    const variantDescription =
      selectedVariant.title && selectedVariant.title !== "Default Title"
        ? ` - ${selectedVariant.title}`
        : "";
    const cartProduct = {
      ...product,
      id: selectedVariant.id === product.variantId ? product.id : selectedVariant.id,
      productId: product.id,
      variantId: selectedVariant.id,
      name: `${product.name}${variantDescription}`,
      basePrice,
      mrp: selectedVariant.mrp ?? product.mrp,
      img: selectedVariant.img || product.img,
      availableForSale: selectedVariant.availableForSale,
      maxQuantity: maximumQuantity,
    };

    for (let i = 0; i < selectedQuantity; i += 1) {
      addToCart(cartProduct);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
        <header className="flex items-center justify-between pb-8 pt-4 lg:pb-10">
          <Link to="/" className="text-xl font-black tracking-[0.24em] text-white uppercase" aria-label="Athleev home">
            ATHLEEV
          </Link>
        </header>

        <main className="grid min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.98fr)_minmax(280px,0.72fr)] xl:gap-8 2xl:gap-10">
          <section className="min-w-0 space-y-6">
            <div className="rounded-[34px] border border-[#c69a4b]/25 bg-[#101010] p-2 shadow-[0_30px_80px_rgba(0,0,0,0.34)] sm:p-3 lg:p-4">
              <div className="flex h-[360px] items-center justify-center overflow-hidden rounded-[28px] border border-[#c69a4b]/35 bg-gradient-to-b from-[#f8f5ee] to-[#ded4c3] p-0 shadow-[inset_0_1px_12px_rgba(0,0,0,0.08),0_18px_40px_rgba(0,0,0,0.24)] sm:h-[480px] lg:h-[540px] xl:h-[520px] 2xl:h-[580px]">
                <img
                  src={selectedImage}
                  alt={product.name}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full scale-105 object-contain object-center drop-shadow-[0_30px_28px_rgba(0,0,0,0.26)] transition-transform duration-700 ease-out hover:scale-110 sm:scale-[1.08] sm:hover:scale-[1.14]"
                />
              </div>
              <div className="mt-5 flex gap-4 overflow-x-auto pb-1">
                {galleryImages.map((src, index) => (
                  <button
                    type="button"
                    key={`${product.id}-${src}-${index}`}
                    onClick={() => setSelectedImageChoice({ productId: product.id, src })}
                    className={`group min-w-[104px] overflow-hidden rounded-2xl border bg-gradient-to-b from-[#f8f5ee] to-[#ded4c3] p-1.5 transition-all duration-300 ${selectedImage === src ? "border-[#c69a4b] shadow-[0_0_24px_rgba(198,154,75,0.22)]" : "border-[#2f2f2f] hover:border-[#c69a4b]/70"}`}
                    aria-label={`Show ${product.name} image ${index + 1}`}
                    aria-pressed={selectedImage === src}
                  >
                    <img
                      src={src}
                      alt={`${product.name} view ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-24 w-full rounded-xl object-contain transition duration-300 group-hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="min-w-0 space-y-7">
            <div className="rounded-[34px] border border-[#262626] bg-[#111] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)] sm:p-8 lg:p-10 xl:p-7 2xl:p-10">
              <p className="inline-flex rounded-full border border-[#c69a4b]/40 bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-[#c69a4b]">{product.category}</p>
              <h1 className="mt-6 text-4xl font-black leading-[1.05] text-white sm:text-5xl 2xl:text-6xl">{product.name}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300">{product.description} Experience premium strength, clean ingredients, and results-driven nutrition designed for elite performance.</p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-[#2b2b2b] bg-[#090909] p-5 text-gray-300 shadow-inner shadow-black">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Category</p>
                  <p className="mt-2 font-semibold text-white">{product.category}</p>
                </div>
                <div className="rounded-3xl border border-[#2b2b2b] bg-[#090909] p-5 text-gray-300 shadow-inner shadow-black">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Net Weight</p>
                  <p className="mt-2 font-semibold text-white">{product.size || "300 g"}</p>
                </div>
              </div>

              <div className="mt-10 space-y-8">
                {optionGroups.map((option) => (
                  <div key={option.name}>
                    <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Choose {option.name}</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {option.values.map((value) => {
                        const optionSelections = { ...selections, [option.name]: value };
                        const optionVariant = variants.find((variant) =>
                          variant.selectedOptions.every((selection) => optionSelections[selection.name] === selection.value)
                        );

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSelectedOptionsChoice({ productId: product.id, values: optionSelections })}
                            className={`rounded-3xl border px-4 py-3 text-left text-sm font-semibold transition ${selections[option.name] === value ? "border-[#c69a4b] bg-[#141414] text-white" : "border-[#2f2f2f] bg-[#090909] text-gray-300 hover:border-[#c69a4b]"}`}
                            aria-pressed={selections[option.name] === value}
                            aria-label={`Choose ${option.name} ${value}`}
                          >
                            <span>{value}</span>
                            {optionVariant && (
                              <span className="mt-1 block text-xs font-medium text-gray-500">
                                {formatPrice(optionVariant.basePrice)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="rounded-[28px] border border-[#c69a4b]/40 bg-white/[0.04] p-5 shadow-[0_18px_45px_rgba(198,154,75,0.12)] backdrop-blur sm:p-6">
                  <div className="flex items-center justify-between text-sm uppercase tracking-[0.28em] text-gray-400">
                    <span>Quantity</span>
                    <span className="rounded-full border border-[#c69a4b]/40 bg-black/70 px-3 py-1 font-black text-[#c69a4b]">{selectedQuantity}</span>
                  </div>
                  <div className="mt-5 flex items-center justify-between overflow-hidden rounded-full border border-[#c69a4b]/60 bg-gradient-to-r from-[#080808] via-[#15120c] to-[#080808] p-1.5 shadow-inner shadow-black">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, selectedQuantity - 1))}
                      className="grid h-[52px] w-[52px] place-items-center rounded-full text-2xl font-black text-[#c69a4b] transition duration-200 hover:scale-105 hover:bg-[#c69a4b] hover:text-black active:scale-95"
                      aria-label={`Decrease ${product.name} quantity`}
                    >
                      −
                    </button>
                    <span className="grid h-[52px] min-w-[88px] place-items-center rounded-full border border-[#c69a4b]/30 bg-black/70 px-8 text-2xl font-black text-white shadow-[0_0_20px_rgba(198,154,75,0.18)]">{selectedQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(maximumQuantity == null ? selectedQuantity + 1 : Math.min(selectedQuantity + 1, maximumQuantity || 1))}
                      className="grid h-[52px] w-[52px] place-items-center rounded-full text-2xl font-black text-[#c69a4b] transition duration-200 hover:scale-105 hover:bg-[#c69a4b] hover:text-black active:scale-95"
                      aria-label={`Increase ${product.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="min-w-0 space-y-6 lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-[760px] xl:sticky xl:top-28 xl:col-span-1 xl:mx-0 xl:max-w-none">
            <div className="min-w-0 overflow-hidden rounded-[34px] border border-[#c69a4b]/30 bg-[#111] p-6 shadow-[0_24px_65px_rgba(0,0,0,0.28)] sm:p-8 xl:p-5 2xl:p-7">
              <div className="space-y-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[#2f2f2f] bg-[#090909] px-4 py-2 text-xs uppercase tracking-[0.28em] text-gray-400">Availability</span>
                  <span className="text-sm uppercase tracking-[0.28em] text-gray-500">{canPurchase ? "In Stock" : "Sold Out"}</span>
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Price</p>
                  <p className="mt-3 text-4xl font-black leading-none text-[#c69a4b] 2xl:text-5xl">{formatPrice(basePrice)}</p>
                  {(selectedVariant?.mrp || product.mrp) && (
                    <p className="text-sm text-gray-500 line-through">MRP {formatPrice(selectedVariant?.mrp || product.mrp)}</p>
                  )}
                  {maximumQuantity !== null && maximumQuantity !== undefined && canPurchase && (
                    <p className="mt-2 text-sm text-gray-500">{maximumQuantity} available</p>
                  )}
                </div>

                <div className="rounded-3xl border border-[#1f1f1f] bg-[#090909] p-6 text-gray-300 shadow-inner shadow-black">
                  <div className="flex items-center justify-between text-sm uppercase tracking-[0.28em] text-gray-500">
                    <span>Quantity</span>
                    <span className="font-semibold text-[#c69a4b]">{selectedQuantity}</span>
                  </div>
                  <div className="mt-3 text-sm text-gray-400">Total</div>
                  <p className="mt-2 text-3xl font-black text-[#c69a4b]">{formatPrice(totalAmount)}</p>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canPurchase}
                  className="w-full rounded-full bg-[#c69a4b] px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-black shadow-lg shadow-[#c69a4b]/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b16f] disabled:cursor-not-allowed disabled:bg-gray-600"
                  aria-label={canPurchase ? `Add ${selectedQuantity} ${product.name} to cart` : `${product.name} is sold out`}
                >
                  {canPurchase ? "Add to Cart" : "Sold Out"}
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`w-full rounded-full border px-5 py-4 text-sm font-black uppercase tracking-[0.16em] transition-all duration-300 hover:-translate-y-0.5 ${wishlistIds.has(product.id) ? "border-[#c69a4b] bg-[#c69a4b] text-black" : "border-[#c69a4b] text-[#c69a4b] hover:bg-[#c69a4b] hover:text-black"}`}
                  aria-label={`${wishlistIds.has(product.id) ? "Remove" : "Add"} ${product.name} ${wishlistIds.has(product.id) ? "from" : "to"} wishlist`}
                >
                  {wishlistIds.has(product.id) ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
              </div>

              <div className="mt-7 rounded-3xl border border-[#2f2f2f] bg-[#090909] p-5 text-gray-300">
                <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Cashback Offer</p>
                <p className="mt-2 font-semibold text-white">Flat ₹250 cashback on prepaid orders</p>
              </div>

              <div className="mt-4 rounded-3xl border border-[#2f2f2f] bg-[#090909] p-5 text-gray-300">
                <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Delivery</p>
                <p className="mt-2 text-white">Fast shipping across India</p>
              </div>
            </div>
          </aside>
        </main>

        <div className="mx-auto max-w-[1240px] px-0 py-14 sm:py-16 lg:py-20">
          <div className="flex flex-col gap-8 sm:gap-10">
            <section className="rounded-[32px] border border-[#262626] bg-[#111] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)] sm:p-8 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#c69a4b]">Complete Formula</p>
              <h2 className="mt-4 text-3xl font-black">Product Overview</h2>
              <p className="mt-5 max-w-4xl text-gray-300 leading-8">{product.description} Crafted for modern athletes, this premium supplement offers advanced nutrient delivery, powerful recovery support, and clean ingredients tailored for performance and wellbeing.</p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {overviewPoints.map((point) => (
                  <div key={point} className="rounded-2xl border border-[#2f2f2f] bg-[#0b0b0b] p-5 text-gray-300">
                    <p className="leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-2">
              <section className="rounded-xl bg-zinc-900 p-6 md:p-8">
                <h2 className="mb-4 text-2xl font-black">How To Use</h2>
                <div className="space-y-4 rounded-xl border border-[#2f2f2f] bg-[#0f0f0f] p-6 text-gray-300">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Step 1</p>
                    <p className="mt-2 leading-relaxed">Mix one scoop with 250 ml of cold water or milk before training.</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Step 2</p>
                    <p className="mt-2 leading-relaxed">Consume immediately for best taste and fast absorption.</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Step 3</p>
                    <p className="mt-2 leading-relaxed">Use daily on training days for optimal performance support.</p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl bg-zinc-900 p-6 md:p-8">
                <h2 className="mb-4 text-2xl font-black">Ingredients</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {ingredients.map((ingredient) => (
                    <div key={ingredient} className="rounded-xl border border-[#2f2f2f] bg-[#0f0f0f] p-4 text-gray-300">
                      <p className="leading-relaxed">{ingredient}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="rounded-[32px] border border-[#262626] bg-[#111] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#c69a4b]">Support</p>
              <h2 className="mb-6 mt-4 text-2xl font-black sm:text-3xl">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqItems.map((item, index) => (
                  <div key={item.question} className="overflow-hidden rounded-2xl border border-[#2f2f2f] bg-[#0b0b0b]">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left text-white transition hover:bg-white/[0.03] sm:px-6"
                      aria-expanded={activeFaq === index}
                    >
                      <span className="font-semibold">{item.question}</span>
                      <span className="text-2xl text-[#c69a4b]">{activeFaq === index ? "−" : "+"}</span>
                    </button>
                    {activeFaq === index && (
                      <div className="border-t border-[#262626] px-5 py-5 leading-7 text-gray-400 sm:px-6">{item.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-[28px] border border-[#262626] bg-[#111] shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
              <button
                type="button"
                onClick={() => setActiveDetailsPanel(activeDetailsPanel === "authentication" ? null : "authentication")}
                className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left transition hover:bg-white/[0.03] sm:px-8"
                aria-expanded={activeDetailsPanel === "authentication"}
              >
                <h2 className="text-xl font-black sm:text-2xl">Product Authentication</h2>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#c69a4b]/35 text-xl text-[#c69a4b]">
                  {activeDetailsPanel === "authentication" ? "-" : "+"}
                </span>
              </button>
              {activeDetailsPanel === "authentication" && (
                <div className="grid gap-4 border-t border-[#262626] p-6 sm:p-8 md:grid-cols-3">
                  {[
                    ["Secure Batch Code", "Scan the code on the label to verify authenticity instantly."],
                    ["Verified Ingredients", "All ingredients are lab-tested for purity and potency."],
                    ["Trusted Quality", "Manufactured in GMP-certified facilities."],
                  ].map(([title, description]) => (
                    <div key={title} className="rounded-2xl border border-[#252525] bg-[#0b0b0b] p-5 text-gray-300">
                      <p className="font-semibold text-[#c69a4b]">{title}</p>
                      <p className="mt-3 leading-7">{description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        <section className="rounded-[32px] border border-[#262626] bg-[#111] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black">Related Products</h2>
              <p className="mt-2 text-gray-400">Customers also bought these top-rated supplements.</p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <div key={item.id} className="group relative flex h-full flex-col rounded-3xl border border-[#2f2f2f] bg-[#090909] p-4 transition hover:-translate-y-1 hover:border-[#c69a4b] sm:p-5">
                <button
                  type="button"
                  onClick={() => toggleWishlist(item)}
                  className={`absolute right-8 top-8 z-10 h-10 w-10 rounded-full border text-lg font-black transition ${wishlistIds.has(item.id) ? "border-[#c69a4b] bg-[#c69a4b] text-black" : "border-[#c69a4b] bg-black/80 text-[#c69a4b] hover:bg-[#c69a4b] hover:text-black"}`}
                  aria-label={`${wishlistIds.has(item.id) ? "Remove" : "Add"} ${item.name} ${wishlistIds.has(item.id) ? "from" : "to"} wishlist`}
                >
                  {wishlistIds.has(item.id) ? "♥" : "♡"}
                </button>
                <div className="flex h-[260px] items-center justify-center overflow-hidden rounded-3xl border border-[#eadfca] bg-[#f5f5f5] p-4 shadow-inner sm:h-[300px]">
                  <img
                    src={item.img}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full scale-110 object-contain object-center drop-shadow-[0_18px_18px_rgba(0,0,0,0.24)] transition-all duration-300 group-hover:scale-125"
                  />
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mt-4">{item.category}</p>
                <h3 className="mt-3 text-xl font-black text-white">{item.name}</h3>
                <p className="mt-4 font-black text-[#c69a4b]">{formatPrice(item.basePrice)}</p>
                <button
                  type="button"
                  onClick={() => { addToCart(item); }}
                  disabled={item.availableForSale === false}
                  className="mt-auto w-full rounded-full border border-[#c69a4b] px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#c69a4b] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c69a4b] hover:text-black disabled:cursor-not-allowed disabled:border-gray-600 disabled:text-gray-500"
                  aria-label={item.availableForSale === false ? `${item.name} is sold out` : `Add ${item.name} to cart`}
                >
                  {item.availableForSale === false ? "Sold Out" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-10 border-t border-[#262626] pt-8 text-sm text-gray-500">
          <div className="flex items-center justify-between">
            <p>© 2026 ATHLEEV. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
