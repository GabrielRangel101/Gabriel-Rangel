import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A página de serviços foi removida: links antigos caem na página Sobre.
  async redirects() {
    return [{ source: "/servicos", destination: "/sobre", permanent: true }];
  },
};

export default nextConfig;
