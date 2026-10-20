import { readFile, writeFile, unlink } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { decompress } from 'wawoff2';

const FONT_FILES = {
	mono: ['@fontsource/geist-mono', 'geist-mono-latin-400-normal.woff2'],
	pixel: ['@fontsource/geist-pixel', 'geist-pixel-latin-400-normal.woff2'],
} as const;

const require = createRequire(import.meta.url);

function fontSource([pkg, file]: readonly [string, string]): string {
	try {
		return require.resolve(`${pkg}/files/${file}`);
	} catch {
		return join(process.cwd(), 'node_modules', pkg, 'files', file);
	}
}

/** resvg reads fonts from disk, so the woff2 subsets are expanded to ttf first. */
async function fontFile(source: string, name: string): Promise<string> {
	const woff2 = await readFile(source);
	const ttf = await decompress(woff2);
	const path = join(tmpdir(), `og-${name}.ttf`);
	await writeFile(path, Buffer.from(ttf));
	return path;
}

/** Renders an SVG to PNG with the site's own typefaces, no system fonts involved. */
export async function renderOg(svg: string): Promise<ArrayBuffer> {
	const [mono, pixel] = await Promise.all([
		fontFile(fontSource(FONT_FILES.mono), 'geist-mono'),
		fontFile(fontSource(FONT_FILES.pixel), 'geist-pixel'),
	]);

	try {
		const resvg = new Resvg(svg, {
			fitTo: { mode: 'width', value: 1200 },
			font: {
				fontFiles: [mono, pixel],
				loadSystemFonts: false,
				defaultFontFamily: 'Geist Mono',
			},
		});

		const png = resvg.render().asPng();
		const copy = new Uint8Array(png.byteLength);
		copy.set(png);
		return copy.buffer as ArrayBuffer;
	} finally {
		await Promise.all([unlink(mono).catch(() => {}), unlink(pixel).catch(() => {})]);
	}
}
