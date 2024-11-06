import type { MetadataRoute} from "next";

export default function manifest() : MetadataRoute.Manifest {
    return {
        name: 'VOB | VISION OF BLOCKCHAIN',
        short_name: 'VOB',
        description: 'The VOB PWA',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
        ]
    }
}