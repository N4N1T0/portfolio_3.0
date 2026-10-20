import TerminalContent from '@/components/TerminalContent.tsx';
import TerminalFrame from '@/components/TerminalFrame.tsx';
import TerminalLoader from '@/components/TerminalLoader.tsx';
import TerminalPromptPanel from '@/components/TerminalPromptPanel.tsx';
import { useTerminalCommands } from '@/components/useTerminalCommands.ts';
import { useTerminalRefs, useTerminalSequence } from '@/components/useTerminalSequence.ts';
import type { TerminalProps } from '@/components/terminal.types.ts';

export default function Terminal({
	boot,
	lines,
	commands,
	altLocale,
	language,
	newTab,
	prompt: promptCopy,
	a11y,
}: TerminalProps) {
	const refs = useTerminalRefs();
	const { output, value, setValue, run } = useTerminalCommands(commands, promptCopy);

	useTerminalSequence(refs, lines);

	return (
		<div class="relative mx-auto flex min-h-[calc(100dvh-4.25rem)] w-full max-w-4xl flex-col px-4 py-6 sm:px-6">
			<TerminalLoader
				boot={boot}
				a11yLabel={a11y.loader}
				loaderRef={refs.loader}
				bootLinesRef={refs.bootLines}
			/>

			<div class="flex flex-1 flex-col justify-center py-6">
				<TerminalFrame title="adrian@portfolio:~">
					<TerminalContent lines={lines} contentRef={refs.content} />

					<div ref={refs.prompt}>
						<TerminalPromptPanel
							commands={commands}
							altLocale={altLocale}
							language={language}
							newTab={newTab}
							prompt={promptCopy}
							acceptLabel={promptCopy.accept}
							a11y={a11y}
							value={value}
							output={output}
							inputRef={refs.input}
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
