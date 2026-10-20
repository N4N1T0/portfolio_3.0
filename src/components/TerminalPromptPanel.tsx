import type { RefObject } from 'preact';
import CommandList from '@/components/CommandList.tsx';
import TerminalPrompt from '@/components/TerminalPrompt.tsx';
import type { Command } from '@/data/commands';

type Props = {
	commands: Command[];
	altLocale: { label: string; href: string };
	language: string;
	prompt: { label: string; placeholder: string };
	a11y: { commands: string; output: string };
	value: string;
	output: string[];
	inputRef: RefObject<HTMLInputElement | null>;
	onRun: (id: string) => void;
	onInput: (value: string) => void;
	onSubmit: () => void;
};

export default function TerminalPromptPanel({
	commands,
	altLocale,
	language,
	prompt,
	a11y,
	value,
	output,
	inputRef,
	onRun,
	onInput,
	onSubmit,
}: Props) {
	return (
		<>
			<p class="sr-only">{a11y.commands}</p>
			<CommandList commands={commands} altLocale={altLocale} language={language} onRun={onRun} />
			<TerminalPrompt
				label={prompt.label}
				placeholder={prompt.placeholder}
				value={value}
				output={output}
				inputRef={inputRef}
				outputLabel={a11y.output}
				onInput={onInput}
				onSubmit={onSubmit}
			/>
		</>
	);
}
