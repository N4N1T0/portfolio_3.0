import type { ComponentChildren } from 'preact';

type Props = {
	title: string;
	children: ComponentChildren;
};

export default function TerminalFrame({ title, children }: Props) {
	return (
		<div class="border border-edge bg-panel/40">
			<div class="flex items-center gap-2 border-b border-edge px-3 py-1.5 text-xs text-phosphor-dim">
				<span class="size-2 bg-phosphor" aria-hidden="true"></span>
				<span class="size-2 bg-phosphor-dim" aria-hidden="true"></span>
				<span class="size-2 bg-phosphor-dim" aria-hidden="true"></span>
				<span class="ml-2">{title}</span>
			</div>
			<div class="px-4 py-5 sm:px-6">{children}</div>
		</div>
	);
}
