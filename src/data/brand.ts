/**
 * The prompt mark: a chevron and a block cursor, outlined (no strokes, no text).
 * Source of truth: public/brand/final-symbol-*.svg. Keep the geometry in sync with those files.
 * The ink box is x 48.63-200, y 62.53-193.47 on a 256 canvas.
 */
export const brandMark = {
	viewBox: '48.63 62.53 151.37 130.94',
	chevron: 'M48.63 81.47 L108.45 128 L48.63 174.53 L63.37 193.47 L147.55 128 L63.37 62.53 Z',
	cursor: { x: 152, y: 152, width: 48, height: 32 },
} as const;
