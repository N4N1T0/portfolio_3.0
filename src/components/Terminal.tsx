import CommandList from '@/components/CommandList.tsx';
import TerminalContent from '@/components/TerminalContent.tsx';
import TerminalFrame from '@/components/TerminalFrame.tsx';
import TerminalLoader from '@/components/TerminalLoader.tsx';
import { useTerminalRefs, useTerminalSequence } from '@/components/useTerminalSequence.ts';
import type { TerminalProps } from '@/components/terminal.types.ts';

export default function Terminal({
	boot,
	lines,
	commands,
	altLocale,
	language,
	newTab,
	a11y,
}: TerminalProps) {
	const refs = useTerminalRefs();

	useTerminalSequence(refs, lines);

	function onRun(id: string) {
		const command = commands.find((item) => item.id === id);
		if (!command) return;
		if (command.external) {
			window.open(command.href, '_blank', 'noopener,noreferrer');
			return;
		}
		window.location.href = command.href;
	}

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

					<div class="mt-5">
						<CommandList
							commands={commands}
							altLocale={altLocale}
							language={language}
							newTab={newTab}
							onRun={onRun}
						/>
					</div>
				</TerminalFrame>
			</div>
		</div>
	);
}
