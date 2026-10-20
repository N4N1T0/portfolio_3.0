import { useState } from 'preact/hooks';
import type { Command } from '@/data/commands';

export function useTerminalCommands(commands: Command[]) {
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
		const command = commands.find((item) => item.id === id);
		if (!command) {
			setOutput((prev) => [...prev, `$ ${id}`, `command not found: ${id}. type help for the list`]);
			return;
		}
		setOutput((prev) => [...prev, `$ ${id}`]);
		window.setTimeout(() => navigate(command), 420);
	}

	return { output, value, setValue, run };
}
