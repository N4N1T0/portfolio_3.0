---
title: 'Máquina de escribir que borra'
excerpt: 'Escribe una línea carácter a carácter y deja que el script se corrija como una terminal de verdad'
preview: 'typewriter-text'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: en/typewriter-text
---

Una máquina de escribir no es solo "el texto aparece lento": una terminal escribe una palabra, ve
que está mal y la borra. Eso pide un script de operaciones en vez de una cadena suelta.

```ts
type LineOp =
	{ type: 'type'; text: string } | { type: 'erase'; text: string } | { type: 'wait'; ms: number };
```

El runner mantiene un buffer y recorre el script carácter a carácter:

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

Y el script de una línea que se corrige:

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

Dos reglas que lo mantienen honesto:

- **el html lleva el texto final**, así los crawlers y quien no tiene JavaScript ven la línea
  completa. El motor la vacía y reproduce el script solo cuando se ejecuta.
- **un solo bucle `requestAnimationFrame` por línea**, con el tiempo acumulado y gastado en
  caracteres por frame, para que un dispositivo lento escriba más despacio en vez de perder
  caracteres.
