import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/portal/'],
        },
        sitemap: 'https://metehanerkan.vercel.app/sitemap.xml',
    }
}
