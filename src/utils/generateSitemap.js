// Sitemap dinámico para X-Ops Conference
// Este archivo debe ser colocado en public/sitemap.xml o generado dinámicamente

const generateSitemap = () => {
  const baseUrl = 'https://xopsconference.com';
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/ponentes', priority: '0.9', changefreq: 'weekly' },
    { url: '/agenda', priority: '0.9', changefreq: 'weekly' },
    { url: '/organizers', priority: '0.8', changefreq: 'monthly' },
    { url: '/patrocinadores', priority: '0.8', changefreq: 'weekly' },
    { url: '/colaboradores', priority: '0.7', changefreq: 'monthly' },
    { url: '/faq', priority: '0.7', changefreq: 'monthly' },
    { url: '/ubicacion', priority: '0.6', changefreq: 'monthly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

export default generateSitemap;
