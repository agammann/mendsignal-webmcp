import type { MetadataRoute } from 'next';

const baseUrl = 'https://pulse.alx21.chatgpt.site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/repairs`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/repair/new`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/dashboard`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/webmcp`, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
