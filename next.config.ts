import type { NextConfig } from "next";

const nextConfig = {
    output: "standalone",
    experimental: {
        reactCompiler: false,
    },
} satisfies NextConfig

export default nextConfig;
