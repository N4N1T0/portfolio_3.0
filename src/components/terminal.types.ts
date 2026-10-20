import type { Command } from '@/data/commands';
import type { LineScript } from '@/lib/terminal-typing';

export type TerminalProps = {
	boot: { heading: string; lines: string[] };
	lines: LineScript[];
	commands: Command[];
	altLocale: { label: string; href: string };
	language: string;
	newTab: string;
	prompt: {
		label: string;
		placeholder: string;
		help: string;
		accept: string;
		notFound: string;
		commandsLabel: string;
	};
	a11y: { loader: string; commands: string; output: string };
};
