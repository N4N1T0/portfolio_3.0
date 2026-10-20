import type { RefObject } from 'preact';
import { useMemo } from 'preact/hooks';
import { suggestCompletion } from '@/lib/terminal-suggest';

type Props = {
	label: string;
	placeholder: string;
	hint: string;
	value: string;
	output: string[];
	commandIds: string[];
	inputRef: RefObject<HTMLInputElement | null>;
	outputLabel: string;
	acceptLabel: string;
	onInput: (value: string) => void;
	onSubmit: () => void;
};

export default function TerminalPrompt({
	label,
	placeholder,
	hint,
	value,
	output,
	commandIds,
	inputRef,
	outputLabel,
	acceptLabel,
	onInput,
	onSubmit,
}: Props) {
	const suggestion = useMemo(() => suggestCompletion(value, commandIds), [value, commandIds]);

	return (
		<>
			<p class="mt-3 text-xs text-phosphor-dim">{hint}</p>
			<form
				class="mt-2 flex items-center gap-2 font-mono text-sm"
				onSubmit={(event) => {
					event.preventDefault();
					onSubmit();
				}}
			>
				<label class="sr-only" for="terminal-input">
					{label}
				</label>
				<span aria-hidden="true" class="text-accent">
					$
				</span>
				<div class="relative min-w-0 flex-1">
					{/* the ghost of the completion, the way an AI IDE shows it */}
					<span
						aria-hidden="true"
						class="pointer-events-none absolute inset-x-0 truncate px-2 text-sm"
					>
						<span class="invisible">{value}</span>
						<span class="text-phosphor-dim">{suggestion}</span>
					</span>
					<input
						id="terminal-input"
						ref={inputRef}
						value={value}
						onInput={(event) => onInput((event.target as HTMLInputElement).value)}
						onKeyDown={(event) => {
							if (event.key !== 'Tab' || !suggestion) return;
							event.preventDefault();
							onInput(value + suggestion);
						}}
						placeholder={placeholder}
						autocomplete="off"
						spellcheck={false}
						class="w-full border border-edge bg-transparent px-2 py-1.5 text-sm text-phosphor caret-block placeholder:text-phosphor-dim focus:border-accent focus:outline-none"
					/>
				</div>
				{suggestion && (
					<span class="hidden shrink-0 text-xs text-phosphor-dim sm:inline">{acceptLabel}</span>
				)}
			</form>

			<div
				aria-live="polite"
				aria-label={outputLabel}
				class="mt-2 min-h-4 font-mono text-sm text-phosphor-dim"
			>
				{output.map((line, index) => (
					<p key={index}>{line}</p>
				))}
			</div>
		</>
	);
}
