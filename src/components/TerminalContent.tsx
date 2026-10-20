import type { RefObject } from 'preact';
import { finalText, type LineScript } from '@/lib/terminal-typing';

type Props = {
	lines: LineScript[];
	contentRef: RefObject<HTMLDivElement | null>;
};

export default function TerminalContent({ lines, contentRef }: Props) {
	return (
		<div
			ref={contentRef}
			class="flex flex-col gap-1 font-mono text-xs leading-relaxed text-phosphor sm:text-sm"
		>
			{lines.map((ops, index) => {
				if (ops.length === 0) return <span class="block h-3" aria-hidden="true" />;
				const text = finalText(ops);
				const body = (
					<>
						<span data-text>{text}</span>
						<span data-cursor class="terminal-cursor" aria-hidden="true" hidden />
					</>
				);
				return index === 0 ? (
					<h1 data-line class="block whitespace-pre-wrap text-phosphor-bright">
						{body}
					</h1>
				) : (
					<span data-line class="block whitespace-pre-wrap">
						{body}
					</span>
				);
			})}
		</div>
	);
}
