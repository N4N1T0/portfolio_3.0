import { useEffect, useRef } from 'preact/hooks';
import { createTimeline } from 'animejs';
import { hasBooted, markBooted } from '@/lib/session';
import { playBoot } from '@/components/useTerminalSequence.ts';
import TerminalLoader from '@/components/TerminalLoader.tsx';

type Props = {
	boot: { heading: string; lines: string[] };
	a11yLabel: string;
};

/** Full-screen boot loader shown once per session on any page entered directly.
 *  When the sequence finishes it hides itself, marks the session as booted and
 *  dispatches `terminal:ready` so the shell prompt can focus and appear. */
export default function TerminalBoot({ boot, a11yLabel }: Props) {
	const loaderRef = useRef<HTMLDivElement>(null);
	const bootLinesRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (hasBooted()) {
			// already booted: nothing to play, but make sure the shell is revealed
			window.dispatchEvent(new CustomEvent('terminal:ready'));
			return;
		}
		const loaderEl = loaderRef.current;
		const bootEl = bootLinesRef.current;
		if (!loaderEl || !bootEl) return;

		const bootItems = Array.from(bootEl.querySelectorAll<HTMLElement>('[data-boot-line]'));
		const heading = loaderEl.querySelector<HTMLElement>('[data-boot-heading]');
		const bar = loaderEl.querySelector<HTMLElement>('[data-bar]');

		const timeline = createTimeline();
		playBoot(timeline, heading, bootItems, bar, loaderEl);

		timeline.call(() => {
			loaderEl.style.visibility = 'hidden';
			markBooted();
			window.dispatchEvent(new CustomEvent('terminal:ready'));
		}, 1500);

		return () => {
			timeline.revert();
		};
	}, []);

	return (
		<TerminalLoader
			loaderRef={loaderRef}
			bootLinesRef={bootLinesRef}
			boot={boot}
			a11yLabel={a11yLabel}
		/>
	);
}
