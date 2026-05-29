import Client from "shopify-buy";

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN?.trim();
const storefrontAccessToken =
  import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
const apiVersion = import.meta.env.VITE_SHOPIFY_API_VERSION || "2026-04";
const cartStorageKey = "athleevShopifyCartId";

export const client = Client.buildClient({
  domain: domain || "athleev-nutrition.myshopify.com",
  storefrontAccessToken: storefrontAccessToken || "",
  apiVersion,
});

const requireConfiguration = () => {
  if (!domain) {
    throw new Error(
      "Missing VITE_SHOPIFY_DOMAIN. Create .env in the project root and set VITE_SHOPIFY_DOMAIN=athleev-nutrition.myshopify.com."
    );
  }

  if (!storefrontAccessToken) {
    throw new Error(
      "Missing VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN. Create .env beside package.json, add your public Headless Storefront token, and restart Vite."
    );
  }
};

export const getShopifyErrorMessage = (error) => {
  const graphQLErrorMessage = error?.graphQLErrors
    ?.map((graphQLError) => graphQLError.message)
    .filter(Boolean)
    .join("; ");
  const message = graphQLErrorMessage || error?.message || String(error);

  if (message.toLowerCase().includes("online store channel is locked")) {
    return "Online Store channel is locked. Activate the Shopify store and use a Storefront token from the Headless sales channel.";
  }

  return message;
};

const toAmount = (money, fallback = null) => {
  const amount = Number(money?.amount ?? money);
  return Number.isFinite(amount) ? amount : fallback;
};

const toArray = (items) => (Array.isArray(items) ? items : []);

const mapVariant = (variant) => ({
  id: variant.id,
  title: variant.title,
  availableForSale: variant.available ?? variant.availableForSale ?? true,
  maxQuantity: null,
  basePrice: toAmount(variant.price, 0),
  mrp: toAmount(variant.compareAtPrice),
  currencyCode: variant.price?.currencyCode || "INR",
  img: variant.image?.src || variant.image?.url || "",
  selectedOptions: toArray(variant.selectedOptions).map((option) => ({
    name: option.name,
    value: option.value,
  })),
});

const mapProduct = (product) => {
  const variants = toArray(product.variants).map(mapVariant);
  const primaryVariant =
    variants.find((variant) => variant.availableForSale) || variants[0];
  const images = toArray(product.images)
    .map((image) => image.src || image.url)
    .filter(Boolean);

  return {
    id: product.handle,
    shopifyId: product.id,
    handle: product.handle,
    source: "shopify",
    name: product.title,
    category: product.productType || "Supplements",
    description: product.description || "Premium athlete nutrition supplement.",
    img: images[0] || primaryVariant?.img || "",
    images,
    basePrice: primaryVariant?.basePrice || 0,
    mrp: primaryVariant?.mrp,
    availableForSale: variants.some((variant) => variant.availableForSale),
    maxQuantity: null,
    variantId: primaryVariant?.id,
    variants,
    options: toArray(product.options)
      .filter((option) => option.name !== "Title")
      .map((option) => ({
        name: option.name,
        values: toArray(option.values).map((value) => value.value || value),
      })),
    currencyCode: primaryVariant?.currencyCode || "INR",
  };
};

export async function fetchStorefrontProducts() {
  requireConfiguration();

  try {
    const products = await client.product.fetchAll();
    return products.map(mapProduct);
  } catch (error) {
    throw new Error(getShopifyErrorMessage(error), { cause: error });
  }
}

let cartPromise;
let cartOperation = Promise.resolve();

const storeCart = (cart) => {
  if (cart?.id) {
    window.localStorage.setItem(cartStorageKey, cart.id);
    cartPromise = Promise.resolve(cart);
  }
  return cart;
};

async function createOrFetchCart() {
  requireConfiguration();

  if (!cartPromise) {
    cartPromise = (async () => {
      const savedCartId = window.localStorage.getItem(cartStorageKey);

      if (savedCartId) {
        try {
          const savedCart = await client.checkout.fetch(savedCartId);
          if (savedCart?.id) return savedCart;
        } catch {
          window.localStorage.removeItem(cartStorageKey);
        }
      }

      return client.checkout.create();
    })().then(storeCart);
  }

  return cartPromise;
}

const queueCartOperation = (operation) => {
  cartOperation = cartOperation.then(operation, operation);
  return cartOperation.catch((error) => {
    throw new Error(getShopifyErrorMessage(error), { cause: error });
  });
};

export function addShopifyCartItem(variantId, quantity = 1) {
  if (!variantId) return Promise.resolve(null);

  return queueCartOperation(async () => {
    const cart = await createOrFetchCart();
    const updatedCart = await client.checkout.addLineItems(cart.id, [{ variantId, quantity }]);
    return storeCart(updatedCart);
  });
}

export function setShopifyCartItemQuantity(variantId, quantity) {
  if (!variantId) return Promise.resolve(null);

  return queueCartOperation(async () => {
    const cart = await createOrFetchCart();
    const lineItem = toArray(cart.lineItems).find((item) => item.variant?.id === variantId);

    if (!lineItem && quantity > 0) {
      const addedCart = await client.checkout.addLineItems(cart.id, [{ variantId, quantity }]);
      return storeCart(addedCart);
    }

    if (!lineItem) return cart;

    const updatedCart =
      quantity > 0
        ? await client.checkout.updateLineItems(cart.id, [{ id: lineItem.id, quantity }])
        : await client.checkout.removeLineItems(cart.id, [lineItem.id]);

    return storeCart(updatedCart);
  });
}

export const shopifyConfig = {
  domain: domain || "athleev-nutrition.myshopify.com",
  apiVersion,
  hasDomain: Boolean(domain),
  hasStorefrontToken: Boolean(storefrontAccessToken),
  isConfigured: Boolean(domain && storefrontAccessToken),
};

export default client;
