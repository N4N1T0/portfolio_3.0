---
title: 'A typewriter that can erase'
excerpt: 'Type a line character by character, and let the script correct itself like a real terminal'
preview: 'typewriter-text'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: es/maquina-de-escribir-que-borra
---

A typewriter is not just "text appears slowly": a terminal writes a word, notices it was wrong, and
erases it. That needs a script of operations instead of a plain string.

```ts
type LineOp =
	{ type: 'type'; text: string } | { type: 'erase'; text: string } | { type: 'wait'; ms: number };
```

The runner keeps a buffer and walks the script one character at a time:

```ts
const advance = () => {
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
```

And the script for a line that corrects itself:

```ts
const line: LineOp[] = [
	{ type: 'type', text: 'Senior ' },
	{ type: 'type', text: 'Frontend' },
	{ type: 'wait', ms: 620 },
	{ type: 'erase', text: 'Frontend' },
	{ type: 'type', text: 'Backend' },
	{ type: 'wait', ms: 620 },
	{ type: 'erase', text: 'Backend' },
	{ type: 'type', text: 'Fullstack' },
];
```

Two rules that keep it honest:

- **the html ships the finished text**, so crawlers and readers without JavaScript see the final
  line. The engine empties it and replays the script only when it runs.
- **one `requestAnimationFrame` loop per line**, with the time accumulated and spent in characters
  per frame, so a slow device types slower instead of dropping characters.
