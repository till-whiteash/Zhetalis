import { build } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

await build({ build: { ssr: 'src/entry-seo.tsx', outDir: 'dist-ssr', rollupOptions: { output: { entryFileNames: 'entry-seo.mjs' } } } });
const { render, PAGES, ORIGIN, organization } = await import(pathToFileURL(path.resolve('dist-ssr/entry-seo.mjs')).href);
const template = await readFile('dist/index.html', 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
for (const page of PAGES) {
  const url = ORIGIN + page.path;
  const head = `<title>${escape(page.title)}</title>
  <meta name="description" content="${escape(page.description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Zhetalis">
  <meta property="og:title" content="${escape(page.title)}">
  <meta property="og:description" content="${escape(page.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ORIGIN}/zhetalis-social.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Zhetalis white logo on a dark background">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(page.title)}">
  <meta name="twitter:description" content="${escape(page.description)}">
  <meta name="twitter:image" content="${ORIGIN}/zhetalis-social.png">
  ${page.path === '/' ? `<script type="application/ld+json">${JSON.stringify(organization).replaceAll('<', '\\u003c')}</script>` : ''}`;
  const html = template.replace(/<title>[\s\S]*?<\/title>/, head).replace('<div id="root"></div>', `<div id="root">${render(page.path)}</div>`);
  const directory = `dist${page.path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}index.html`, html);
}
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES.map(page => `  <url><loc>${ORIGIN}${page.path}</loc></url>`).join('\n')}\n</urlset>\n`);
// Real missing pages retain an HTTP 404 and cannot advertise a home-page canonical.
await writeFile('dist/404.html', template.replace(/<script type="module"[^>]*>[\s\S]*?<\/script>/g, '').replace('<title>Zhetalis</title>', '<title>Page not found | Zhetalis</title><meta name="robots" content="noindex">').replace('<div id="root"></div>', '<main><h1>Page not found</h1><p><a href="/">Return to Zhetalis</a></p></main>'));
console.log(`Prerendered ${PAGES.length} pages and generated sitemap.xml.`);
