import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only type-check the portable application, not the retained Worker tooling.
  typescript: { tsconfigPath: 'tsconfig.vercel.json' },
};

export default nextConfig;
