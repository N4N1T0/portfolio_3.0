import { useMemo, useRef, useState } from 'preact/hooks';
import type { Command } from '@/data/commands';
import { readHistory } from '@/lib/session';
import { suggestCompletion } from '@/lib/terminal-suggest';
import { useTerminalCommands } from '@/components/useTerminalCommands.ts';

type PromptCopy = {
	label: string;
	placeholder: string;
	help: string;
	accept: string;
	notFound: string;
	commandsLabel: string;
	historyLabel: string;
	pathLabel: string;
};

type Props = {
	commands: Command[];
	altLocale: { label: string; href: string };
	language: string;
	prompt: PromptCopy;
	a11y: { output: string };
	locale: string;
	homePath: string;
	currentPath: string;
};

export default function ShellPrompt({
	commands,
	altLocale,
	language,
	prompt,
	a11y,
	locale,
	homePath,
	currentPath,
}: Props) {
	const { output, value, setValue, run } = useTerminalCommands(commands, prompt, {
		locale,
		homePath,
		currentPath,
	});
	const [historyIndex, setHistoryIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);

	const suggestion = useMemo(
		() =>
			suggestCompletion(
				value,
				commands.map((command) => command.id),
			),
		[value, commands],
	);

	function recallHistory(step: number) {
		const history = readHistory();
		if (history.length === 0) return;
		const next = Math.min(Math.max(historyIndex + step, -1), history.length - 1);
		setHistoryIndex(next);
		setValue(next === -1 ? '' : history[history.length - 1 - next]);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Tab' && suggestion) {
			event.preventDefault();
			setValue(value + suggestion);
			return;
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			recallHistory(1);
			return;
		}
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			recallHistory(-1);
		}
	}

	return (
		<div class="fixed inset-x-0 bottom-8 z-20 border-t border-edge bg-ground/95 px-4 backdrop-blur-sm">
			<div class="mx-auto w-full max-w-4xl">
				<div
					aria-live="polite"
					aria-label={a11y.output}
					class="max-h-16 overflow-y-auto pt-1 font-mono text-xs text-phosphor-dim"
				>
					{output.map((line, index) => (
						<p key={index}>{line}</p>
					))}
				</div>

				<form
					class="flex items-center gap-2 py-1.5 font-mono text-sm"
					onSubmit={(event) => {
						event.preventDefault();
						run(value);
						setValue('');
						setHistoryIndex(-1);
					}}
				>
					<label class="sr-only" for="shell-input">
						{prompt.label}
					</label>
					<span aria-hidden="true" class="text-accent">
						$
					</span>
					<div class="relative min-w-0 flex-1">
						<span
							aria-hidden="true"
							class="pointer-events-none absolute inset-x-0 truncate px-2 text-sm"
						>
							<span class="invisible">{value}</span>
							<span class="text-phosphor-dim">{suggestion}</span>
						</span>
						<input
							id="shell-input"
							ref={inputRef}
							value={value}
							onInput={(event) => setValue((event.target as HTMLInputElement).value)}
							onKeyDown={handleKeyDown}
							placeholder={prompt.placeholder}
							autocomplete="off"
							spellcheck={false}
							class="w-full border border-edge bg-transparent px-2 py-1 text-sm text-phosphor caret-block placeholder:text-phosphor-dim focus:border-accent focus:outline-none"
						/>
					</div>
					{suggestion && (
						<span class="hidden shrink-0 text-xs text-phosphor-dim sm:inline">{prompt.accept}</span>
					)}
					<span class="hidden shrink-0 text-xs text-phosphor-dim md:inline">
						{altLocale.label} · {language}
					</span>
				</form>
			</div>
		</div>
	);
}
