import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: () =>
		z.object({
			title: z.string().max(70),
			date: z.date(),
			dateModified: z.date().optional(),
			excerpt: z.string().max(160),
			author: z.string(),
			counterpartId: z.string(),
			tags: z.array(z.string()).default([]),
		}),
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
	schema: ({ image }) =>
		z.object({
			title: z.string().max(60),
			date: z.string(),
			excerpt: z.string(),
			images: z.array(
				z.object({
					src: image().optional(),
					alt: z.string(),
				}),
			),
			liveLink: z.url(),
			colors: z.string(),
			techStack: z.array(
				z.object({
					title: z.string(),
					link: z.url(),
				}),
			),
			challenge: z.string().optional(),
			solution: z.string().optional(),
			testimonial: z
				.object({
					name: z.string(),
					quote: z.string(),
					role: z.string(),
				})
				.nullable(),
			comingSoon: z.boolean().optional(),
			counterpartId: z.string().optional(),
		}),
});

const snippets = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/snippets' }),
	schema: () =>
		z.object({
			title: z.string(),
			excerpt: z.string(),
			preview: z.string(),
			icon: z.enum(['code', 'block']),
			isNew: z.boolean().optional(),
			comingSoon: z.boolean().optional(),
			counterpartId: z.string().optional(),
		}),
});

export const collections = { blog, projects, snippets };
