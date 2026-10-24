import rss from '@astrojs/rss';
import { copy, type Locale } from '@/data/copy';
import { getPosts } from '@/lib/content';

// the English feed keeps the /rss.xml url portfolio_2.0 had indexed
export const feedPath = (locale: Locale) => (locale === 'en' ? '/rss.xml' : `/${locale}/rss.xml`);

export async function blogFeed(locale: Locale, site: URL): Promise<Response> {
	const t = copy[locale];
	const posts = await getPosts(locale);

	return rss({
		title: `${t.collections.blogTitle} · ${t.meta.title}`,
		description: t.collections.blogSubtitle,
		site,
		customData: `<language>${locale}</language>`,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.excerpt,
			pubDate: post.data.date,
			categories: post.data.tags,
			link: `/${locale}/blog/${post.id}/`,
		})),
	});
}
