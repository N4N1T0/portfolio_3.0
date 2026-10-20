export type LineOp =
	{ type: 'type'; text: string } | { type: 'erase'; text: string } | { type: 'wait'; ms: number };

export type LineScript = LineOp[];

/** The text a line ends with, whatever it did on the way there. */
export function finalText(ops: LineScript): string {
	let buffer = '';
	for (const op of ops) {
		if (op.type === 'type') buffer += op.text;
		else if (op.type === 'erase')
			buffer = buffer.slice(0, Math.max(0, buffer.length - op.text.length));
	}
	return buffer;
}

type Runner = {
	advance: () => 'typed' | 'wait' | 'done';
	buffer: () => string;
	paused: () => boolean;
};

/** Walks the script one character at a time, forwards to write and backwards to erase. */
function createRunner(ops: LineScript): Runner {
	let buffer = '';
	let opIndex = 0;
	let charPos = 0;
	let waitUntil = 0;

	const advance = (): 'typed' | 'wait' | 'done' => {
		while (opIndex < ops.length) {
			const op = ops[opIndex];
			if (op.type === 'wait') {
				waitUntil = performance.now() + op.ms;
				opIndex += 1;
				return 'wait';
			}
			if (op.type === 'type') {
				if (charPos < op.text.length) {
					buffer += op.text[charPos];
					charPos += 1;
					return 'typed';
				}
				opIndex += 1;
				charPos = 0;
				continue;
			}
			if (charPos < op.text.length) {
				buffer = buffer.slice(0, -1);
				charPos += 1;
				return 'typed';
			}
			opIndex += 1;
			charPos = 0;
		}
		return 'done';
	};

	return {
		advance,
		buffer: () => buffer,
		paused: () => performance.now() < waitUntil,
	};
}

type Job = { done: Promise<void>; cancel: () => void };

/**
 * Types a line the way a terminal does: one character at a time, with a block
 * cursor in front of the next character, and the ability to erase what it wrote.
 */
export function typeLine(el: HTMLElement, ops: LineScript, charMs: number): Job {
	const textEl = el.querySelector<HTMLElement>('[data-text]');
	const cursorEl = el.querySelector<HTMLElement>('[data-cursor]');
	if (!textEl) return { done: Promise.resolve(), cancel: () => {} };

	const runner = createRunner(ops);
	let last = performance.now();
	let acc = 0;
	let raf = 0;
	let settle = () => {};

	const done = new Promise<void>((resolve) => {
		settle = resolve;
	});

	const step = (now: number) => {
		const delta = now - last;
		last = now;

		if (runner.paused()) {
			acc = 0;
			raf = requestAnimationFrame(step);
			return;
		}

		acc += delta;
		while (acc >= charMs) {
			acc -= charMs;
			const state = runner.advance();
			if (state === 'done') {
				textEl.textContent = runner.buffer();
				cursorEl?.setAttribute('hidden', '');
				settle();
				return;
			}
			if (state === 'wait') break;
		}

		textEl.textContent = runner.buffer();
		raf = requestAnimationFrame(step);
	};

	cursorEl?.removeAttribute('hidden');
	raf = requestAnimationFrame(step);

	return {
		done,
		cancel: () => {
			cancelAnimationFrame(raf);
			textEl.textContent = finalText(ops);
			cursorEl?.setAttribute('hidden', '');
			settle();
		},
	};
}
