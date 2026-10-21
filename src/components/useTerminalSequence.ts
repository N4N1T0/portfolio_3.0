import { useEffect, useRef } from 'preact/hooks';
import type { RefObject } from 'preact';
import { animate, createTimeline, stagger } from 'animejs';
import { hasBooted, markBooted } from '@/lib/session';
import { typeLine, type LineScript } from '@/lib/terminal-typing';

const CHAR_MS = 14;

type SequenceRefs = {
	loader: RefObject<HTMLDivElement | null>;
	bootLines: RefObject<HTMLDivElement | null>;
	content: RefObject<HTMLDivElement | null>;
	list: RefObject<HTMLDivElement | null>;
};

type Timeline = ReturnType<typeof createTimeline>;

export function useTerminalRefs(): SequenceRefs {
	return {
		loader: useRef<HTMLDivElement>(null),
		bootLines: useRef<HTMLDivElement>(null),
		content: useRef<HTMLDivElement>(null),
		list: useRef<HTMLDivElement>(null),
	};
}

export function playBoot(
	timeline: Timeline,
	heading: HTMLElement | null,
	bootItems: HTMLElement[],
	bar: HTMLElement | null,
	loader: HTMLElement,
) {
	if (heading) {
		timeline.add(heading, { opacity: [0, 1], translateY: [-4, 0], duration: 220 }, 0);
	}
	timeline.add(bootItems, { opacity: [0, 1], translateY: [4, 0], duration: 150 }, 110);
	if (bar) timeline.add(bar, { scaleX: [0, 1], duration: 900, ease: 'outQuad' }, 100);
	timeline.add(loader, { opacity: [1, 0], duration: 300, ease: 'outQuad' }, 1150);
}

/** Boots the terminal: loader, then the typewriter, then the command list. */
export function useTerminalSequence(
	{ loader, bootLines, content, list }: SequenceRefs,
	scripts: LineScript[],
) {
	useEffect(() => {
		const loaderEl = loader.current;
		const bootEl = bootLines.current;
		const contentEl = content.current;
		const listEl = list.current;
		if (!loaderEl || !bootEl || !contentEl || !listEl) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || hasBooted()) {
			loaderEl.remove();
			contentEl.style.opacity = '1';
			listEl.style.opacity = '1';
			window.dispatchEvent(new CustomEvent('terminal:ready'));
			return;
		}

		loaderEl.style.animation = 'none';
		contentEl.style.opacity = '0';
		listEl.style.opacity = '0';

		const bootItems = Array.from(bootEl.querySelectorAll<HTMLElement>('[data-boot-line]'));
		const heading = loaderEl.querySelector<HTMLElement>('[data-boot-heading]');
		const lines = Array.from(contentEl.querySelectorAll<HTMLElement>('[data-line]'));
		const commandRows = Array.from(listEl.querySelectorAll<HTMLElement>('[data-command]'));
		const bar = loaderEl.querySelector<HTMLElement>('[data-bar]');

		for (const row of commandRows) row.style.opacity = '0';

		const timeline = createTimeline();
		playBoot(timeline, heading, bootItems, bar, loaderEl);
		timeline.add(contentEl, { opacity: [0, 1], duration: 220 }, 1350);

		let cancelled = false;
		const jobs: { cancel: () => void }[] = [];

		timeline.call(() => {
			// the html ships the finished text for crawlers: empty every line
			// before typing starts, so nothing is revealed before its turn
			for (const line of lines) {
				const text = line.querySelector<HTMLElement>('[data-text]');
				if (text) text.textContent = '';
			}
			void (async () => {
				for (const [index, line] of lines.entries()) {
					if (cancelled) return;
					const job = typeLine(line, scripts[index] ?? [], CHAR_MS);
					jobs.push(job);
					await job.done;
				}
				if (cancelled) return;
				listEl.style.opacity = '1';
				if (commandRows.length > 0) {
					animate(commandRows, {
						opacity: [0, 1],
						translateY: [6, 0],
						duration: 180,
						delay: stagger(45),
					});
				}
				window.dispatchEvent(new CustomEvent('terminal:ready'));
			})();
		}, 1350);

		timeline.call(() => {
			markBooted();
		}, 0);

		return () => {
			cancelled = true;
			for (const job of jobs) job.cancel();
			timeline.revert();
		};
	}, [loader, bootLines, content, list]);
}
