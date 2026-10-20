import type { RefObject } from 'preact';

type Props = {
	boot: { heading: string; lines: string[] };
	a11yLabel: string;
	loaderRef: RefObject<HTMLDivElement | null>;
	bootLinesRef: RefObject<HTMLDivElement | null>;
};

export default function TerminalLoader({ boot, a11yLabel, loaderRef, bootLinesRef }: Props) {
	return (
		<div
			ref={loaderRef}
			class="pointer-events-none absolute inset-0 z-20 flex loader-exit flex-col justify-center gap-2 bg-ground px-6 font-mono text-sm text-phosphor sm:text-base"
			role="status"
			aria-label={a11yLabel}
		>
			<p class="font-display text-xs text-phosphor-bright sm:text-sm">{boot.heading}</p>
			<div ref={bootLinesRef} class="space-y-1">
				{boot.lines.map((line) => (
					<p data-boot-line class="text-phosphor-dim opacity-0">
						{line}
					</p>
				))}
			</div>
			<div class="mt-3 h-2 w-48 border border-edge">
				{/* the fill is a transform, not a tailwind scale: tailwind v4 uses the
				    separate `scale` property and would win over the animation */}
				<div data-bar class="h-full w-full origin-left loader-bar" style="transform: scaleX(0)" />
			</div>
		</div>
	);
}
