import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bigode.example',
  build: { inlineStylesheets: 'auto' },
  image: { responsiveStyles: false },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
