// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // 本番は www 付き。www 無しは Vercel 側で www へ 301 させる。
  // ここが www 無しだと sitemap だけ別ホストを指し、canonical と食い違う。
  site: 'https://www.andlabtokyo.com',
  // Wix 時代のURLは末尾スラッシュ無し（例 /rawfood）。sitemap もそれに合わせる。
  trailingSlash: 'never',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
