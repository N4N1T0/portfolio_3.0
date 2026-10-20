import type { Command } from '@/data/commands';

export type TerminalProps = {
	boot: { heading: string; lines: string[] };
	lines: string[];
	commands: Command[];
	altLocale: { label: string; href: string };
	language: string;
	newTab: string;
	prompt: {
		label: string;
		placeholder: string;
		help: string;
		notFound: string;
		commandsLabel: string;
	};
	a11y: { loader: string; commands: string; output: string };
};
