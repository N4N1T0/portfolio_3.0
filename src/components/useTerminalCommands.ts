import { useState } from 'preact/hooks';
import type { Command } from '@/data/commands';

type PromptCopy = {
	notFound: string;
	commandsLabel: string;
};

export function useTerminalCommands(commands: Command[], prompt: PromptCopy) {
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
			const list = commands.map((item) => item.id).join(', ');
			setOutput((prev) => [...prev, `${prompt.commandsLabel}: ${list}`]);
			return;
		}
		const command = commands.find((item) => item.id === id);
		if (!command) {
			setOutput((prev) => [...prev, `$ ${id}`, prompt.notFound.replace('{id}', id)]);
			return;
		}
		setOutput((prev) => [...prev, `$ ${id}`]);
		window.setTimeout(() => navigate(command), 420);
	}

	return { output, value, setValue, run };
}
