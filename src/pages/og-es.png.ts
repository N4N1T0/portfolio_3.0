import type { APIRoute } from 'astro';
import { ogSvg } from '@/lib/og-svg';
import { renderOg } from '@/lib/og';

export const GET: APIRoute = async () => {
	const png = await renderOg(
		ogSvg({
			role: 'Ingeniero Fullstack Senior',
			pitch: 'APIs · interfaces · sistemas de datos en producción',
			command: '$ adrian --info',
		}),
	);

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=86400',
		},
	});
};
