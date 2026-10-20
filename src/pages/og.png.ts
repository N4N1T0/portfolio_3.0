import type { APIRoute } from 'astro';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
	<rect width="${WIDTH}" height="${HEIGHT}" fill="#0a0805" />
	<rect x="40" y="40" width="${WIDTH - 80}" height="${HEIGHT - 80}" fill="none" stroke="#2a2214" stroke-width="2" />
	<rect x="40" y="40" width="${WIDTH - 80}" height="56" fill="#12100b" />
	<circle cx="76" cy="68" r="8" fill="#ffb000" />
	<circle cx="108" cy="68" r="8" fill="#7d5a1a" />
	<circle cx="140" cy="68" r="8" fill="#7d5a1a" />
	<text x="180" y="76" fill="#7d5a1a" font-family="monospace" font-size="22">adrian@portfolio:~</text>
	<text x="80" y="230" fill="#ffd894" font-family="monospace" font-size="72" letter-spacing="2">ADRIAN ALVAREZ</text>
	<text x="80" y="300" fill="#ffb000" font-family="monospace" font-size="34">Senior Fullstack Engineer</text>
	<text x="80" y="372" fill="#7d5a1a" font-family="monospace" font-size="26">APIs . interfaces . data systems in production</text>
	<text x="80" y="470" fill="#ffb000" font-family="monospace" font-size="26">$ adrian --info</text>
	<rect x="80" y="500" width="420" height="8" fill="#ffb000" />
	<rect x="500" y="500" width="120" height="8" fill="#7d5a1a" />
</svg>`;

export const GET: APIRoute = async () => {
	const png = await sharp(Buffer.from(svg)).png().toBuffer();
	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=86400',
		},
	});
};
