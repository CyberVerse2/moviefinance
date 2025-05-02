/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence warnings
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // Add image configuration
  images: {
    dangerouslyAllowSVG: true, // Allows loading SVGs
    contentDispositionType: 'attachment', // Recommended security setting
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Recommended security setting
    // If you load images from external domains later, add them here:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'example.com',
    //   },
    // ],
  },
};

export default nextConfig;
