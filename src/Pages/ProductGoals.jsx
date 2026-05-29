import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const goalCategories = [
  {
    id: "muscle-building",
    title: "Muscle Building",
    tag: "Build",
    description: "Protein and strength essentials for lean mass and recovery.",
    productNames: ["whey protein", "mass gainer", "creatine", "l-glutamine"],
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1100&auto=format&fit=crop",
  },
  {
    id: "performance-boosters",
    title: "Performance Boosters",
    tag: "Perform",
    description: "Fuel focus, endurance, and intensity through every session.",
    productNames: ["pre workout", "eaa", "bcaa", "akg", "beta alanine"],
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1100&auto=format&fit=crop",
  },
  {
    id: "weight-management",
    title: "Weight Management",
    tag: "Lean",
    description: "Nutrition support for a leaner, more controlled routine.",
    productNames: ["isolate protein"],
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1100&auto=format&fit=crop",
  },
  {
    id: "healthy-lifestyle",
    title: "Healthy Lifestyle",
    tag: "Daily",
    description: "Daily wellness staples for health, recovery, and consistency.",
    productNames: ["multivitamin", "omega 3 fish oil", "post workout", "testosterone booster"],
    img: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1100&auto=format&fit=crop",
  },
];

const productSlugsByName = {
  akg: "athleev-akg",
  "beta alanine": "athleev-beta-alanine",
  bcaa: "athleev-bcaa",
  creatine: "athleev-creatine",
  eaa: "athleev-eaa",
  "isolate protein": "athleev-whey-isolate",
  "l glutamine": "athleev-l-glutamine",
  "mass gainer": "athleev-mass-gainer",
  "multivitamin for men": "athleev-multivitamin",
  "omega 3 fish oil": "athleev-omega-3-fish-oil",
  "post workout": "athleev-post-workout",
  "pre workout": "athleev-pre-workout",
  "testosterone booster": "athleev-testosterone-booster",
  "whey protein": "athleev-whey-protein",
};

const normalise = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const matchesGoal = (product, goal) => {
  const productName = normalise(product.name);
  return goal.productNames.some((name) => {
    const requestedName = normalise(name);
    return productName.includes(requestedName) || requestedName.includes(productName);
  });
};

const getProductSlug = (product) =>
  product.slug ||
  productSlugsByName[normalise(product.name)] ||
  `athleev-${normalise(product.name).replace(/\s+/g, "-")}`;

const getProductPath = (product, fallbackCategorySlug) =>
  product.slug && product.categorySlug
    ? `/${product.categorySlug}/${product.slug}`
    : `/${fallbackCategorySlug}/${getProductSlug(product)}`;

export default function ProductGoals({
  products = [],
  cart = [],
  addToCart,
  formatPrice,
}) {
  const [selectedGoalId, setSelectedGoalId] = useState(goalCategories[0].id);
  const selectedGoal =
    goalCategories.find((goal) => goal.id === selectedGoalId) || goalCategories[0];
  const cartIds = new Set(cart.map((item) => item.id));

  const selectedProducts = useMemo(
    () => products.filter((product) => matchesGoal(product, selectedGoal)),
    [products, selectedGoal]
  );

  useEffect(() => {
    document.title = "Products By Goals | Athleev Nutrition";
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black px-5 py-12 text-white sm:px-8 md:px-12 lg:px-20 md:py-16">
      <section className="ath-section-container">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#c69a4b]">
            Shop Your Objective
          </p>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl md:text-6xl">
            PRODUCTS BY <span className="text-[#c69a4b]">GOALS</span>
          </h1>
          <p className="mt-5 leading-relaxed text-gray-400">
            Choose your goal and discover Athleev formulas curated for each stage of your fitness journey.
          </p>
        </div>

        <div className="mt-10 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {goalCategories.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => setSelectedGoalId(goal.id)}
              className={`group relative min-h-[230px] overflow-hidden rounded-3xl border text-left transition duration-300 hover:-translate-y-1 ${
                selectedGoal.id === goal.id
                  ? "border-[#c69a4b] shadow-[0_20px_55px_rgba(198,154,75,0.2)]"
                  : "border-[#c69a4b]/35 hover:border-[#c69a4b]/80"
              }`}
              aria-label={`Show ${goal.title} products`}
              aria-pressed={selectedGoal.id === goal.id}
            >
              <img
                src={goal.img}
                alt={`${goal.title} fitness goal`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/15" />
              <div className="relative flex min-h-[230px] flex-col justify-end p-5">
                <span className="mb-3 w-fit rounded-full border border-[#c69a4b]/70 bg-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#c69a4b]">
                  {goal.tag}
                </span>
                <h2 className="text-xl font-black">{goal.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">{goal.description}</p>
              </div>
            </button>
          ))}
        </div>

        <section className="ath-premium-card mt-12 border-[#c69a4b]/30 bg-[#0d0d0d] p-5 sm:p-8">
          <div className="flex flex-col gap-5 border-b border-[#c69a4b]/20 pb-7 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#c69a4b]">
                Recommended Range
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">{selectedGoal.title}</h2>
              <p className="mt-2 text-gray-400">{selectedGoal.description}</p>
            </div>
            <Link
              to="/shop"
              className="ath-btn-outline self-start md:self-auto"
            >
              View All Products
            </Link>
          </div>

          {selectedProducts.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              Products for this goal will be available soon.
            </div>
          ) : (
            <div className="mt-8 grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {selectedProducts.map((product) => (
                <article
                  key={product.id}
                  className="ath-product-card group flex h-full flex-col overflow-hidden border-[#c69a4b]/45"
                >
                  <Link to={getProductPath(product, selectedGoal.id)} className="m-4 mb-0 flex h-[270px] items-center justify-center overflow-hidden rounded-3xl border border-[#eadfca] bg-[#f5f5f5] p-4">
                    <img
                      src={product.img}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-110"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">
                      {product.category}
                    </p>
                    <Link to={getProductPath(product, selectedGoal.id)} className="mt-3 text-xl font-black transition hover:text-[#c69a4b]">
                      {product.name}
                    </Link>
                    <p className="mt-4 text-2xl font-black text-[#c69a4b]">
                      {formatPrice(product.basePrice)}
                    </p>
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      disabled={product.availableForSale === false}
                      className="ath-btn-primary mt-auto px-5 py-3 disabled:cursor-not-allowed disabled:bg-gray-600"
                    >
                      {product.availableForSale === false
                        ? "Sold Out"
                        : cartIds.has(product.id)
                          ? "Add Another"
                          : "Add To Cart"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
