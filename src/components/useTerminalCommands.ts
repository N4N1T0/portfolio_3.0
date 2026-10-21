import { useState } from 'preact/hooks';
import type { Command } from '@/data/commands';
import { pushHistory, readHistory } from '@/lib/session';

type PromptCopy = {
	notFound: string;
	commandsLabel: string;
	historyLabel: string;
	pathLabel: string;
};

type Options = {
	locale: string;
	homePath: string;
	currentPath: string;
	numericEntries?: Array<{ number: number; label: string; href: string }>;
};

export function useTerminalCommands(commands: Command[], prompt: PromptCopy, options: Options) {
	const [output, setOutput] = useState<string[]>([]);
	const [value, setValue] = useState('');

	function navigate(command: Command) {
		if (command.external) {
			window.open(command.href, '_blank', 'noopener,noreferrer');
			return;
		}
		window.location.href = command.href;
	}

	function run(raw: string) {
		const id = raw.trim().toLowerCase();
		if (!id) return;

		if (id === 'help' || id === 'ls') {
			const list = commands.map((command) => command.id).join(', ');
			setOutput((prev) => [...prev, `${prompt.commandsLabel}: ${list}`]);
			return;
		}

		if (id === 'history') {
			const history = readHistory();
			setOutput((prev) => [
				...prev,
				history.length > 0
					? `${prompt.historyLabel}: ${history.join(' | ')}`
					: `${prompt.historyLabel}: (empty)`,
			]);
			return;
		}

		if (id === 'pwd') {
			setOutput((prev) => [...prev, `${prompt.pathLabel}: ${options.currentPath}`]);
			return;
		}

		if (id === 'clear') {
			setOutput([]);
			return;
		}

		if (id === 'cd -') {
			setOutput((prev) => [...prev, '$ cd -']);
			pushHistory('cd -');
			window.history.back();
			return;
		}

		if (id === 'cd ~' || id === 'cd') {
			setOutput((prev) => [...prev, '$ cd ~']);
			pushHistory('cd ~');
			window.location.href = options.homePath;
			return;
		}

		if (id.startsWith('cd ') && options.numericEntries) {
			const n = Number(id.slice(3).trim());
			if (Number.isInteger(n) && n > 0) {
				const entry = options.numericEntries.find((item) => item.number === n);
				if (entry) {
					setOutput((prev) => [...prev, `$ cd ${n}`]);
					pushHistory(`cd ${n}`);
					window.location.href = entry.href;
					return;
				}
			}
		}

		const target = id.startsWith('cd ') ? id.slice(3).trim() : id;
		const command = commands.find((item) => item.id === target);
		if (!command) {
			setOutput((prev) => [...prev, `$ ${id}`, prompt.notFound.replace('{id}', id)]);
			return;
		}

		setOutput((prev) => [...prev, `$ ${target}`]);
		pushHistory(target);
		window.setTimeout(() => navigate(command), 420);
	}

	return { output, value, setValue, run };
}
