import createNextIntlPlugin  from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.blockchaintoday.co.kr',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'vobc-image-bucket.s3.ap-northeast-2.amazonaws.com',
                pathname: '/**',
            },
        ]
    },
    // experimental: {
    //     scrollRestoration: true
    // }
};

export default withNextIntl(nextConfig);
