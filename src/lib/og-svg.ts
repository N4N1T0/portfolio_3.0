const GROUND = '#070a12';
const PANEL = '#0b1018';
const EDGE = '#1b2333';
const ACCENT = '#4d9dff';
const BRIGHT = '#e9f0ff';
const DIM = '#6d809f';

type OgCopy = {
	role: string;
	pitch: string;
	command: string;
};

export function ogSvg({ role, pitch, command }: OgCopy): string {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
	<rect width="1200" height="630" fill="${GROUND}" />
	<rect x="48" y="48" width="1104" height="534" fill="${PANEL}" stroke="${EDGE}" stroke-width="2" />
	<rect x="48" y="48" width="1104" height="56" fill="#0e141f" />
	<rect x="80" y="68" width="14" height="14" fill="${ACCENT}" />
	<rect x="104" y="68" width="14" height="14" fill="${DIM}" />
	<rect x="128" y="68" width="14" height="14" fill="${DIM}" />
	<text x="166" y="84" font-family="Geist Mono" font-size="20" fill="${DIM}">adrian@portfolio:~</text>
	<text x="80" y="228" font-family="Geist Pixel" font-size="88" fill="${BRIGHT}" letter-spacing="3">ADRIÁN ÁLVAREZ</text>
	<text x="80" y="296" font-family="Geist Mono" font-size="34" fill="${ACCENT}">${role}</text>
	<text x="80" y="356" font-family="Geist Mono" font-size="26" fill="${DIM}">${pitch}</text>
	<text x="80" y="452" font-family="Geist Mono" font-size="26" fill="${ACCENT}">${command}</text>
	<rect x="80" y="480" width="420" height="10" fill="${ACCENT}" />
	<rect x="500" y="480" width="120" height="10" fill="${DIM}" />
</svg>`;
}
