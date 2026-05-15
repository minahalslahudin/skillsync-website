/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Required for @react-pdf/renderer — it depends on canvas which isn't available in Node
    config.resolve.alias = { ...config.resolve.alias, canvas: false }
    return config
  },
}

export default nextConfig
