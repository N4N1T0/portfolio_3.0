// @ts-check
import { readFileSync, readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

const site = 'https://www.adrian-alvarez.com';

// lastmod for every post, read from the frontmatter: dateModified wins over date
const postDates = new Map(
	['en', 'es'].flatMap((locale) =>
		readdirSync(`src/content/blog/${locale}`).map((file) => {
			const frontmatter = readFileSync(`src/content/blog/${locale}/${file}`, 'utf8');
			const date = (frontmatter.match(/^dateModified: (\S+)$/m) ??
				frontmatter.match(/^date: (\S+)$/m))?.[1];
			return [`${site}/${locale}/blog/${file.replace(/\.md$/, '')}/`, date];
		}),
	),
);

// https://astro.build/config
export default defineConfig({
	site,
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
		sitemap({
			// the root is a meta-refresh to /en/, it must not be in the sitemap
			filter: (page) => page !== `${site}/`,
			serialize: (item) => {
				const date = postDates.get(decodeURI(item.url));
				return date ? { ...item, lastmod: new Date(date).toISOString() } : item;
			},
		}),
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
