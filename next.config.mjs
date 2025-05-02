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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/f/**', // Allow any path starting with /f/
      },
    ],
  },
};

export default nextConfig;
