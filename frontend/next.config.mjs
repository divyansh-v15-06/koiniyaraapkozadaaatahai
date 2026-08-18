/** @type {import('next').NextConfig} */

const nextConfig = {
    // Self-contained server bundle for the Docker runtime image
    output: 'standalone',
    images: {
        domains: ['portfolios.nith.ac.in', 'res.cloudinary.com'],
    },
    typescript: {
        // Ignore legacy typescript compilation errors on build
        ignoreBuildErrors: true,
    },
    eslint: {
        // Ignore legacy linting rules during build
        ignoreDuringBuilds: true,
    },
}

export default nextConfig
