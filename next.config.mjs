/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Allow production builds even with ESLint warnings (dev mode still shows them)
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;

