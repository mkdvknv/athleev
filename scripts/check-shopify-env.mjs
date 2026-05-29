import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv } from "vite";

const root = process.cwd();
const envFile = resolve(root, ".env");
const env = loadEnv("development", root, "");
const domain = env.VITE_SHOPIFY_DOMAIN?.trim();
const token = env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();

if (!existsSync(envFile)) {
  console.error("Shopify env check failed: create .env in the project root beside package.json.");
  process.exitCode = 1;
} else if (!domain || !token) {
  console.error(
    "Shopify env check failed: .env must set VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN."
  );
  process.exitCode = 1;
} else {
  console.log(`Shopify env ready: domain=${domain}, storefrontToken=loaded.`);
}
