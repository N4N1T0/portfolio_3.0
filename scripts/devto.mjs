/* eslint-disable no-console -- build scripts report to the deploy log */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const API = 'https://dev.to/api';
const HOST = 'www.adrian-alvarez.com';
const KEY = process.env.DEVTO_API_KEY;
const DRY = process.env.DEVTO_DRY === '1';
const DIRECTORY = new URL('../src/content/blog/en/', import.meta.url);
const STATE = new URL('./devto-state.json', import.meta.url);

if ((!KEY && !DRY) || (process.env.VERCEL_ENV !== 'production' && !DRY)) {
	console.log('dev.to: skipped, no key or not a production build');
	process.exit(0);
}

// only the posts that opted in through a `devto: YYYY-MM-DD` frontmatter date
function parse(file) {
	const text = readFileSync(new URL(file, DIRECTORY), 'utf8');
	const [, raw = '', body = ''] = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/) ?? [];
	const field = (name) => raw.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim() ?? '';
	const tags = field('tags')
		.replace(/^\[|\]$/g, '')
		.split(',')
		.map((tag) =>
			tag
				.trim()
				.replace(/^['"]|['"]$/g, '')
				.toLowerCase(),
		)
		.filter(Boolean);

	return {
		slug: file.replace(/\.md$/, ''),
		publishAt: field('devto'),
		title: field('title')
			.replace(/^['"]|['"]$/g, '')
			.replace(/''/g, "'"),
		excerpt: field('excerpt')
			.replace(/^['"]|['"]$/g, '')
			.replace(/''/g, "'"),
		tags: tags.slice(0, 4),
		body: body.trim().replace(/\]\(\//g, `](https://${HOST}/`),
	};
}

async function call(method, path, article) {
	const response = await fetch(`${API}${path}`, {
		method,
		headers: { 'api-key': KEY, 'content-type': 'application/json; charset=utf-8' },
		body: JSON.stringify({ article }),
	});
	if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
	return response.json();
}

const today = new Date().toISOString().slice(0, 10);
const state = JSON.parse(readFileSync(STATE, 'utf8'));
let changed = false;

for (const file of readdirSync(DIRECTORY).filter((name) => name.endsWith('.md'))) {
	const post = parse(file);
	if (!post.publishAt || post.publishAt > today) continue;

	const canonical = `https://${HOST}/en/blog/${post.slug}/`;
	const article = {
		title: post.title,
		body_markdown: post.body,
		description: post.excerpt,
		tags: post.tags,
		canonical_url: canonical,
		published: true,
	};
	const hash = createHash('sha1').update(JSON.stringify(article)).digest('hex');
	const known = state[post.slug];

	if (known?.hash === hash) continue;

	if (DRY) {
		console.log(`dev.to: would ${known ? 'update' : 'create'} ${canonical}`);
		continue;
	}

	try {
		const saved = known
			? await call('PUT', `/articles/${known.id}`, article)
			: await call('POST', '/articles', article);
		state[post.slug] = { id: saved.id, hash };
		changed = true;
		console.log(`dev.to: ${known ? 'updated' : 'published'} ${canonical} (id ${saved.id})`);
	} catch (error) {
		// a failed cross-post must not take the deploy down
		console.warn(`dev.to: ${post.slug} failed, ${error.message}`);
	}
}

if (changed) writeFileSync(STATE, `${JSON.stringify(state, null, '\t')}\n`);
