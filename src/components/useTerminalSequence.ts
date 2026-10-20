import { useEffect } from 'preact/hooks';
import type { RefObject } from 'preact';
import { createTimeline, stagger } from 'animejs';

const CHAR_MS = 16;
const LINE_GAP_MS = 90;

type SequenceRefs = {
	loader: RefObject<HTMLDivElement | null>;
	bootLines: RefObject<HTMLDivElement | null>;
	content: RefObject<HTMLDivElement | null>;
	prompt: RefObject<HTMLDivElement | null>;
	input: RefObject<HTMLInputElement | null>;
};

type Timeline = ReturnType<typeof createTimeline>;

function playBoot(
	timeline: Timeline,
	bootItems: HTMLElement[],
	bar: HTMLElement | null,
	loader: HTMLElement,
) {
	timeline.add(bootItems, { opacity: [0, 1], translateY: [4, 0], duration: 160 }, 120);
	if (bar) timeline.add(bar, { scaleX: [0, 1], duration: 1500, ease: 'outQuad' }, 120);
	timeline.add(loader, { opacity: [1, 0], duration: 320, ease: 'outQuad' }, 1750);
}

function typeLines(timeline: Timeline, lines: HTMLElement[]): number {
	let cursor = 2150;
	for (const line of lines) {
		const chars = Array.from(line.querySelectorAll<HTMLElement>('[data-char]'));
		if (chars.length === 0) continue;
		for (const char of chars) char.style.opacity = '0';
		timeline.add(chars, { opacity: [0, 1], duration: 60, delay: stagger(CHAR_MS) }, cursor);
		cursor += chars.length * CHAR_MS + 60 + LINE_GAP_MS;
	}
	return cursor;
}

/** Boots the terminal: loader, then the typewriter, then the prompt. */
export function useTerminalSequence({ loader, bootLines, content, prompt, input }: SequenceRefs) {
	useEffect(() => {
		const loaderEl = loader.current;
		const bootEl = bootLines.current;
		const contentEl = content.current;
		const promptEl = prompt.current;
		if (!loaderEl || !bootEl || !contentEl || !promptEl) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			loaderEl.remove();
			contentEl.style.opacity = '1';
			promptEl.style.opacity = '1';
			return;
		}

		loaderEl.style.animation = 'none';
		contentEl.style.opacity = '0';
		promptEl.style.opacity = '0';

		const timeline = createTimeline();
		const bootItems = Array.from(bootEl.querySelectorAll<HTMLElement>('[data-boot-line]'));
		const lines = Array.from(contentEl.querySelectorAll<HTMLElement>('[data-line]'));
		const bar = loaderEl.querySelector<HTMLElement>('[data-bar]');

		playBoot(timeline, bootItems, bar, loaderEl);
		timeline.add(contentEl, { opacity: [0, 1], duration: 240 }, 2050);
		const cursor = typeLines(timeline, lines);
		timeline.add(promptEl, { opacity: [0, 1], duration: 300 }, cursor + 120);
		timeline.call(() => {
			if (window.matchMedia('(pointer: fine)').matches)
				input.current?.focus({ preventScroll: true });
		}, cursor + 420);

		return () => timeline.revert();
	}, [loader, bootLines, content, prompt, input]);
}
