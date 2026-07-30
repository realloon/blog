import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://realloon.com',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  devToolbar: {
    enabled: true,
  },
  prefetch: true,
})
