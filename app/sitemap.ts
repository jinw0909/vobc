import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return [
        {
            url: 'https://vobc.io/en',
            lastModified,
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://vobc.io/jp',
            lastModified,
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://vobc.io/cn',
            lastModified,
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://vobc.io/en/about',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: 'https://vobc.io/jp/about',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: 'https://vobc.io/cn/about',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: 'https://vobc.io/en/devs',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://vobc.io/jp/devs',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://vobc.io/cn/devs',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://vobc.io/en/team',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://vobc.io/jp/team',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://vobc.io/cn/team',
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://vobc.io/en/news',
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: 'https://vobc.io/jp/news',
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: 'https://vobc.io/cn/news',
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
    ];
}
