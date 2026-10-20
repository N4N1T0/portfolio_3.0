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
	prompt: RefObject<HTMLDivElement | null>;
	input: RefObject<HTMLInputElement | null>;
};

type Timeline = ReturnType<typeof createTimeline>;

export function useTerminalRefs(): SequenceRefs {
	return {
		loader: useRef<HTMLDivElement>(null),
		bootLines: useRef<HTMLDivElement>(null),
		content: useRef<HTMLDivElement>(null),
		prompt: useRef<HTMLDivElement>(null),
		input: useRef<HTMLInputElement>(null),
	};
}

function playBoot(
	timeline: Timeline,
	heading: HTMLElement | null,
	bootItems: HTMLElement[],
	bar: HTMLElement | null,
	loader: HTMLElement,
) {
	if (heading) {
		timeline.add(heading, { opacity: [0, 1], translateY: [-4, 0], duration: 260 }, 0);
	}
	timeline.add(bootItems, { opacity: [0, 1], translateY: [4, 0], duration: 160 }, 140);
	if (bar) timeline.add(bar, { scaleX: [0, 1], duration: 1500, ease: 'outQuad' }, 120);
	timeline.add(loader, { opacity: [1, 0], duration: 320, ease: 'outQuad' }, 1750);
}

/** Boots the terminal: loader, then the typewriter, then the prompt. */
export function useTerminalSequence(
	{ loader, bootLines, content, prompt, input }: SequenceRefs,
	scripts: LineScript[],
) {
	useEffect(() => {
		const loaderEl = loader.current;
		const bootEl = bootLines.current;
		const contentEl = content.current;
		const promptEl = prompt.current;
		if (!loaderEl || !bootEl || !contentEl || !promptEl) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || hasBooted()) {
			loaderEl.remove();
			contentEl.style.opacity = '1';
			promptEl.style.opacity = '1';
			promptEl.style.pointerEvents = 'auto';
			return;
		}

		loaderEl.style.animation = 'none';
		contentEl.style.opacity = '0';
		promptEl.style.opacity = '0';
		promptEl.style.pointerEvents = 'none';

		const bootItems = Array.from(bootEl.querySelectorAll<HTMLElement>('[data-boot-line]'));
		const heading = loaderEl.querySelector<HTMLElement>('[data-boot-heading]');
		const lines = Array.from(contentEl.querySelectorAll<HTMLElement>('[data-line]'));
		const commandRows = Array.from(promptEl.querySelectorAll<HTMLElement>('[data-command]'));
		const bar = loaderEl.querySelector<HTMLElement>('[data-bar]');

		for (const row of commandRows) row.style.opacity = '0';

		const timeline = createTimeline();
		playBoot(timeline, heading, bootItems, bar, loaderEl);
		timeline.add(contentEl, { opacity: [0, 1], duration: 240 }, 2050);

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
				promptEl.style.opacity = '1';
				promptEl.style.pointerEvents = 'auto';
				if (commandRows.length > 0) {
					animate(commandRows, {
						opacity: [0, 1],
						translateY: [6, 0],
						duration: 180,
						delay: stagger(45),
					});
				}
				const idle = document.activeElement === document.body;
				if (idle && window.matchMedia('(pointer: fine)').matches) {
					input.current?.focus({ preventScroll: true });
				}
			})();
		}, 2050);

		timeline.call(() => {
			markBooted();
		}, 0);

		return () => {
			cancelled = true;
			for (const job of jobs) job.cancel();
			timeline.revert();
		};
	}, [loader, bootLines, content, prompt, input]);
}
