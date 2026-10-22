import { readFileSync } from 'node:fs';

const HOST = 'www.adrian-alvarez.com';
const KEY = '59f7c7ccca1744c980a0a1638d246e89';

// Vercel also builds previews, and those must not announce production URLs
if (process.env.VERCEL_ENV !== 'production' && process.env.INDEXNOW_FORCE !== '1') {
	console.log('IndexNow: skipped, not a production build');
	process.exit(0);
}

const sitemap = readFileSync(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');
// the whole sitemap: at 68 URLs it is cheaper than diffing, and IndexNow dedupes
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

try {
	const response = await fetch('https://api.indexnow.org/indexnow', {
		method: 'POST',
		headers: { 'content-type': 'application/json; charset=utf-8' },
		body: JSON.stringify({
			host: HOST,
			key: KEY,
			keyLocation: `https://${HOST}/${KEY}.txt`,
			urlList,
		}),
	});
	console.log(`IndexNow: ${response.status} for ${urlList.length} URLs`);
} catch (error) {
	// a failed ping is not a broken site, so the deploy still goes out
	console.warn(`IndexNow: ${error.message}`);
}
