import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Command } from '@/data/commands';
import { copy, type Locale } from '@/data/copy';
import { profile } from '@/data/profile';

export type NavItem = { id: string; label: string; href: string };

/** The destinations of the session bar, the way a terminal lists its directories. */
export function buildNav(locale: Locale): NavItem[] {
	const t = copy[locale];
	return [
		{ id: 'about', label: t.about.title, href: getRelativeLocaleUrl(locale, 'about') },
		{
			id: 'projects',
			label: t.collections.projectsTitle,
			href: getRelativeLocaleUrl(locale, 'projects'),
		},
		{ id: 'blog', label: t.collections.blogTitle, href: getRelativeLocaleUrl(locale, 'blog') },
		{
			id: 'snippets',
			label: t.collections.snippetsTitle,
			href: getRelativeLocaleUrl(locale, 'snippets'),
		},
	];
}

/** The commands the shell runs, resolved to their real destination. */
export function buildCommands(locale: Locale): Command[] {
	const t = copy[locale];
	const local: Record<string, string> = {
		about: getRelativeLocaleUrl(locale, 'about'),
		cv: '/cv/adrian-alvarez-alonso-cv.pdf',
		projects: getRelativeLocaleUrl(locale, 'projects'),
		blog: getRelativeLocaleUrl(locale, 'blog'),
		snippets: getRelativeLocaleUrl(locale, 'snippets'),
		email: `mailto:${profile.email}`,
	};

	return t.commands.map((command) => ({
		id: command.id,
		label: command.id,
		hint: command.hint,
		href:
			local[command.id] ?? profile.socials.find((social) => social.id === command.id)?.url ?? '#',
		external: command.external,
	}));
}
