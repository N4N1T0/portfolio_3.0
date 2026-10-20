import { useRef } from 'preact/hooks';
import TerminalContent from '@/components/TerminalContent.tsx';
import TerminalFrame from '@/components/TerminalFrame.tsx';
import TerminalLoader from '@/components/TerminalLoader.tsx';
import TerminalPromptPanel from '@/components/TerminalPromptPanel.tsx';
import { useTerminalCommands } from '@/components/useTerminalCommands.ts';
import { useTerminalSequence } from '@/components/useTerminalSequence.ts';
import type { Command } from '@/data/commands';

type Props = {
	boot: { heading: string; lines: string[] };
	lines: string[];
	commands: Command[];
	altLocale: { label: string; href: string };
	language: string;
	prompt: { label: string; placeholder: string };
	a11y: { loader: string; commands: string; output: string };
};

export default function Terminal({
	boot,
	lines,
	commands,
	altLocale,
	language,
	prompt: promptCopy,
	a11y,
}: Props) {
	const loaderRef = useRef<HTMLDivElement>(null);
	const bootLinesRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const promptRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const { output, value, setValue, run } = useTerminalCommands(commands);

	useTerminalSequence({
		loader: loaderRef,
		bootLines: bootLinesRef,
		content: contentRef,
		prompt: promptRef,
		input: inputRef,
	});

	return (
		<div class="relative mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-4 py-6 sm:px-6">
			<TerminalLoader
				boot={boot}
				a11yLabel={a11y.loader}
				loaderRef={loaderRef}
				bootLinesRef={bootLinesRef}
			/>

			<div class="flex flex-1 flex-col justify-center py-6">
				<TerminalFrame title="adrian@portfolio:~">
					<TerminalContent lines={lines} contentRef={contentRef} />

					<div ref={promptRef} class="opacity-0">
						<TerminalPromptPanel
							commands={commands}
							altLocale={altLocale}
							language={language}
							prompt={promptCopy}
							a11y={a11y}
							value={value}
							output={output}
							inputRef={inputRef}
							onRun={run}
							onInput={setValue}
							onSubmit={() => {
								run(value);
								setValue('');
							}}
						/>
					</div>
				</TerminalFrame>
			</div>
		</div>
	);
}
