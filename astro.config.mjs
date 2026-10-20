// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.adrian-alvarez.com',
	trailingSlash: 'always',
	output: 'static',
	adapter: vercel(),
	devToolbar: {
		enabled: true,
		// the toolbar sits at the bottom: keep it away from the shell prompt
		placement: 'bottom-left',
	},
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
