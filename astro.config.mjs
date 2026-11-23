import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://unravel-xu.github.io',
  base: '/real-rsi-site',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'real-rsi',
      disable404Route: true,
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },
      components: {
        Header: './src/components/DocsHeader.astro',
        PageFrame: './src/components/DocsFrame.astro',
      },
      customCss: ['./src/styles/site.css'],
      sidebar: [
        {
          label: '开始使用',
          items: [
            { slug: 'docs' },
            { slug: 'docs/import' },
            { slug: 'docs/gsm8k' },
          ],
        },
        {
          label: '社区贡献',
          items: [{ slug: 'docs/contribute' }],
        },
      ],
    }),
  ],
});
