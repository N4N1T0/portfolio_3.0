import type { RefObject } from 'preact';

type Props = {
	lines: string[];
	contentRef: RefObject<HTMLDivElement | null>;
};

function TypedChars({ line }: { line: string }) {
	return (
		<>
			{Array.from(line).map((char) => (
				<span data-char>{char}</span>
			))}
		</>
	);
}

export default function TerminalContent({ lines, contentRef }: Props) {
	return (
		<div
			ref={contentRef}
			class="flex flex-col gap-1 font-mono text-xs leading-relaxed text-phosphor sm:text-sm"
		>
			{lines.map((line, index) =>
				line === '' ? (
					<span class="block h-3" aria-hidden="true" />
				) : index === 0 ? (
					<h1 data-line class="block whitespace-pre-wrap text-phosphor-bright">
						<TypedChars line={line} />
					</h1>
				) : (
					<span data-line class="block whitespace-pre-wrap">
						<TypedChars line={line} />
					</span>
				),
			)}
		</div>
	);
}
