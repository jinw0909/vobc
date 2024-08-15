import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return [
        {
            url: 'https://www.vobc.io',
            lastModified,
            changeFrequency: 'monthly',
            priority: 1,
        },
        // {
        //     url: 'https://www.vobc.io/favicon.svg',
        //     lastModified,
        //     changeFrequency: 'yearly',
        //     priority: 1,
        // },
        {
            url: 'https://www.vobc.io/favicon.ico',
            lastModified,
            changeFrequency: 'yearly',
            priority: 1,
        },
        // {
        //     url: 'https://www.vobc.io/icon.svg',
        //     lastModified,
        //     changeFrequency: 'yearly',
        //     priority: 1,
        // },
        {
            url: 'https://www.vobc.io/en',
            lastModified,
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://www.vobc.io/jp',
            lastModified,
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://www.vobc.io/cn',
            lastModified,
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://www.vobc.io/en/about',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: 'https://www.vobc.io/jp/about',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: 'https://www.vobc.io/cn/about',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: 'https://www.vobc.io/en/devs',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://www.vobc.io/jp/devs',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://www.vobc.io/cn/devs',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://www.vobc.io/en/team',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://www.vobc.io/jp/team',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://www.vobc.io/cn/team',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://www.vobc.io/en/news',
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: 'https://www.vobc.io/jp/news',
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: 'https://www.vobc.io/cn/news',
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: 'https://www.vobc.io/en/news/media',
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: 'https://www.vobc.io/jp/news/media',
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: 'https://www.vobc.io/cn/news/media',
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.5,
        }
    ];
}
