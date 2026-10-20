import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/data/copy';

const strip = (id: string, locale: Locale) => id.replace(`${locale}/`, '');

export async function getPosts(locale: Locale): Promise<Array<CollectionEntry<'blog'>>> {
	const posts = await getCollection('blog', ({ id }) => id.startsWith(`${locale}/`));
	return posts
		.map((post) => ({ ...post, id: strip(post.id, locale) }))
		.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getProjects(locale: Locale): Promise<Array<CollectionEntry<'projects'>>> {
	const projects = await getCollection('projects', ({ id }) => id.startsWith(`${locale}/`));
	return projects
		.map((project) => ({ ...project, id: strip(project.id, locale) }))
		.sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date));
}

export async function getSnippets(locale: Locale): Promise<Array<CollectionEntry<'snippets'>>> {
	const snippets = await getCollection('snippets', ({ id }) => id.startsWith(`${locale}/`));
	return snippets.map((snippet) => ({ ...snippet, id: strip(snippet.id, locale) }));
}

export async function getPost(
	locale: Locale,
	id: string,
): Promise<CollectionEntry<'blog'> | undefined> {
	const posts = await getCollection('blog');
	return posts.find((post) => post.id === `${locale}/${id}`);
}

export async function getProject(
	locale: Locale,
	id: string,
): Promise<CollectionEntry<'projects'> | undefined> {
	const projects = await getCollection('projects');
	return projects.find((project) => project.id === `${locale}/${id}`);
}

export async function getSnippet(
	locale: Locale,
	id: string,
): Promise<CollectionEntry<'snippets'> | undefined> {
	const snippets = await getCollection('snippets');
	return snippets.find((snippet) => snippet.id === `${locale}/${id}`);
}
