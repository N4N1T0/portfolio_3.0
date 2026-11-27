import type { APIRoute } from 'astro';
import { copy } from '@/data/copy';
import { profile } from '@/data/profile';
import { USER_DATA } from '@/data/site-data';
import { getProjects } from '@/lib/content';
import { feedPath } from '@/lib/rss';

// https://llmstxt.org: built from src/data and the collections, so it never goes stale
export const GET: APIRoute = async ({ site }) => {
	const { meta, collections, about } = copy.en;
	const link = (name: string, path: string, note?: string) =>
		`- [${name}](${new URL(path, site).href})${note ? `: ${note}` : ''}`;
	const projects = await getProjects('en');

	const lines = [
		`# ${meta.title}`,
		'',
		`> ${meta.description}`,
		'',
		'The site is available in English (/en/) and Spanish (/es/).',
		'',
		'## Pages',
		'',
		link('Home', '/en/', meta.description),
		link(about.title, '/en/about/', about.subtitle),
		link(collections.projectsTitle, '/en/projects/', collections.projectsSubtitle),
		link(collections.blogTitle, '/en/blog/', collections.blogSubtitle),
		link(collections.snippetsTitle, '/en/snippets/', collections.snippetsSubtitle),
		link('Spanish version', '/es/', copy.es.meta.description),
		'',
		`## ${collections.projectsTitle}`,
		'',
		...projects.map(({ id, data }) => link(data.title, `/en/projects/${id}/`, data.excerpt)),
		'',
		'## Author',
		'',
		`${profile.name}, ${profile.role}. ${profile.location}.`,
		'',
		...USER_DATA.about.en.flatMap((paragraph) => [paragraph, '']),
		'## Contact',
		'',
		...profile.socials.map((social) => link(social.label, social.url)),
		'',
		'## Optional',
		'',
		link('RSS feed', feedPath('en'), collections.blogSubtitle),
		link('Sitemap', '/sitemap-index.xml'),
		'',
	];

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
