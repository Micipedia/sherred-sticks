import type { NextConfig } from "next";

// When deploying to GitHub Pages the site is served from a sub-path
// (e.g. /sherred-sticks). The Pages build sets NEXT_PUBLIC_BASE_PATH; local
// dev leaves it empty so the site runs from the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Static export — no server needed. Perfect for a preview on GitHub Pages.
  // The real Stripe checkout (server route) slots in when we move to production.
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
