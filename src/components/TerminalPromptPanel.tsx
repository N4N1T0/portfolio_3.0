import type { RefObject } from 'preact';
import CommandList from '@/components/CommandList.tsx';
import TerminalPrompt from '@/components/TerminalPrompt.tsx';
import type { Command } from '@/data/commands';

type Props = {
	commands: Command[];
	altLocale: { label: string; href: string };
	language: string;
	newTab: string;
	prompt: { label: string; placeholder: string; help: string };
	acceptLabel: string;
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
	newTab,
	prompt,
	a11y,
	acceptLabel,
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
			<CommandList
				commands={commands}
				altLocale={altLocale}
				language={language}
				newTab={newTab}
				onRun={onRun}
			/>
			<TerminalPrompt
				label={prompt.label}
				placeholder={prompt.placeholder}
				hint={prompt.help}
				value={value}
				output={output}
				commandIds={commands.map((command) => command.id)}
				inputRef={inputRef}
				outputLabel={a11y.output}
				acceptLabel={acceptLabel}
				onInput={onInput}
				onSubmit={onSubmit}
			/>
		</>
	);
}
