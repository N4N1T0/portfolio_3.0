import type { RefObject } from 'preact';

type Props = {
	label: string;
	placeholder: string;
	value: string;
	output: string[];
	inputRef: RefObject<HTMLInputElement | null>;
	outputLabel: string;
	onInput: (value: string) => void;
	onSubmit: () => void;
};

export default function TerminalPrompt({
	label,
	placeholder,
	value,
	output,
	inputRef,
	outputLabel,
	onInput,
	onSubmit,
}: Props) {
	return (
		<>
			<form
				class="mt-3 flex items-center gap-2 font-mono text-sm"
				onSubmit={(event) => {
					event.preventDefault();
					onSubmit();
				}}
			>
				<label class="sr-only" for="terminal-input">
					{label}
				</label>
				<span aria-hidden="true" class="text-phosphor-bright">
					$
				</span>
				<input
					id="terminal-input"
					ref={inputRef}
					value={value}
					onInput={(event) => onInput((event.target as HTMLInputElement).value)}
					placeholder={placeholder}
					autocomplete="off"
					spellcheck={false}
					class="w-full bg-transparent text-phosphor placeholder:text-phosphor-dim/60 focus:outline-none"
				/>
				<span aria-hidden="true" class="caret-blink text-phosphor-bright">
					_
				</span>
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
