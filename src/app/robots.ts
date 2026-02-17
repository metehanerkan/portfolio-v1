import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/portal/'],
        },
        sitemap: 'https://www.metehandev.site/sitemap.xml',
    }
}
