// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.adrian-alvarez.com',
	trailingSlash: 'always',
	integrations: [
		preact(),
		// the root is a meta-refresh to /en/, it must not be in the sitemap
		sitemap({ filter: (page) => page !== 'https://www.adrian-alvarez.com/' }),
	],
	i18n: {
		locales: ['en', 'es'],
		defaultLocale: 'en',
		routing: {
			prefixDefaultLocale: true,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
