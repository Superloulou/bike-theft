import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Génère .next/standalone : un serveur autonome, suffisant pour servir la maquette
  // sans copier tout node_modules (contrainte de disque sur la VM de production).
  output: "standalone",
};

export default nextConfig;
