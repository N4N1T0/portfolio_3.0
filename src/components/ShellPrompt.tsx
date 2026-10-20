import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useTerminalCommands } from '@/components/useTerminalCommands.ts';
import type { Command } from '@/data/commands';
import { readHistory } from '@/lib/session';
import { suggestCompletion } from '@/lib/terminal-suggest';

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

type HelpCopy = {
	title: string;
	pages: string;
	commands: string;
	close: string;
	language: string;
	items: { id: string; hint: string }[];
};

type Props = {
	commands: Command[];
	nav: { id: string; label: string; href: string }[];
	altLocale: { label: string; href: string };
	prompt: PromptCopy;
	help: HelpCopy;
	a11y: { output: string };
	locale: string;
	homePath: string;
	currentPath: string;
	buildDate: string;
	copyright: string;
};

export default function ShellPrompt({
	commands,
	nav,
	altLocale,
	prompt,
	help,
	a11y,
	locale,
	homePath,
	currentPath,
	buildDate,
	copyright,
}: Props) {
	const { output, value, setValue, run } = useTerminalCommands(commands, prompt, {
		locale,
		homePath,
		currentPath,
	});
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [helpOpen, setHelpOpen] = useState(false);
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

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key.toLowerCase() === 'b') {
				event.preventDefault();
				setHelpOpen((open) => !open);
				return;
			}
			if (event.key === 'Escape') setHelpOpen(false);
		};
		const onReady = () => {
			if (document.activeElement === document.body)
				inputRef.current?.focus({ preventScroll: true });
		};
		document.addEventListener('keydown', onKey);
		window.addEventListener('terminal:ready', onReady);
		return () => {
			document.removeEventListener('keydown', onKey);
			window.removeEventListener('terminal:ready', onReady);
		};
	}, []);

	return (
		<>
			<div
				aria-live="polite"
				aria-label={a11y.output}
				class="mx-auto max-h-16 w-full max-w-4xl overflow-y-auto pt-1 font-mono text-xs text-phosphor-dim"
			>
				{output.map((line, index) => (
					<p key={index}>{line}</p>
				))}
			</div>

			<div class="grid grid-cols-[1fr_minmax(0,56rem)_1fr] items-center gap-4 py-1.5 font-mono text-xs">
				<span class="truncate text-phosphor-dim">{copyright}</span>
				<form
					class="flex w-full min-w-0 items-center gap-2 justify-self-center text-sm"
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
					<button
						type="button"
						onClick={() => setHelpOpen(true)}
						class="shrink-0 border border-edge px-2 py-1 text-xs text-phosphor-dim transition-colors hover:text-accent"
					>
						ctrl-b
					</button>
				</form>
				<span class="min-w-0 text-right text-phosphor-dim tabular-nums">{buildDate}</span>
			</div>

			{helpOpen && (
				<div
					class="fixed inset-0 z-40 flex items-center justify-center bg-ground/80 p-4"
					onClick={() => setHelpOpen(false)}
				>
					<div
						role="dialog"
						aria-modal="true"
						aria-label={help.title}
						class="w-full max-w-2xl border border-edge bg-panel"
						onClick={(event) => event.stopPropagation()}
					>
						<div class="flex items-center gap-2 border-b border-edge px-3 py-1.5 text-xs text-phosphor-dim">
							<span class="size-2 bg-accent" aria-hidden="true"></span>
							<span class="size-2 bg-phosphor-dim" aria-hidden="true"></span>
							<span class="size-2 bg-phosphor-dim" aria-hidden="true"></span>
							<span class="ml-2">adrian@portfolio:~/help</span>
						</div>

						<div class="grid gap-6 px-4 py-5 sm:grid-cols-2">
							<div>
								<p class="text-xs text-phosphor-bright">{help.pages}</p>
								<ul class="mt-2 space-y-1 font-mono text-sm">
									{nav.map((item) => (
										<li key={item.id}>
											<a
												href={item.href}
												class="flex items-baseline gap-3 text-accent hover:underline"
											>
												<span class="w-24 shrink-0">{item.label}</span>
												<span class="text-phosphor-dim">
													{commands.find((command) => command.id === item.id)?.hint}
												</span>
											</a>
										</li>
									))}
									<li>
										<a
											href={altLocale.href}
											hreflang={altLocale.label}
											class="flex items-baseline gap-3 text-accent hover:underline"
										>
											<span class="w-24 shrink-0">{altLocale.label}</span>
											<span class="text-phosphor-dim">{help.language}</span>
										</a>
									</li>
								</ul>
							</div>

							<div>
								<p class="text-xs text-phosphor-bright">{help.commands}</p>
								<ul class="mt-2 space-y-1 font-mono text-sm">
									{help.items.map((item) => (
										<li key={item.id} class="flex items-baseline gap-3">
											<span class="w-28 shrink-0 text-accent">{item.id}</span>
											<span class="text-phosphor-dim">{item.hint}</span>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div class="border-t border-edge px-4 py-2 text-xs text-phosphor-dim">{help.close}</div>
					</div>
				</div>
			)}
		</>
	);
}
