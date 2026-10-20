import type { RefObject } from 'preact';

type Props = {
	lines: string[];
	contentRef: RefObject<HTMLDivElement | null>;
};

export default function TerminalContent({ lines, contentRef }: Props) {
	return (
		<div
			ref={contentRef}
			class="flex flex-col gap-1 font-mono text-xs leading-relaxed text-phosphor sm:text-sm"
		>
			{lines.map((line) =>
				line === '' ? (
					<span class="block h-3" aria-hidden="true" />
				) : (
					<span data-line class="block whitespace-pre-wrap">
						{Array.from(line).map((char) => (
							<span data-char>{char}</span>
						))}
					</span>
				),
			)}
		</div>
	);
}
