export const profile = {
	name: "Adrián 'Nano' Álvarez Alonso",
	shortName: 'Adrián Álvarez',
	initials: 'AAA',
	role: 'Senior Fullstack Engineer',
	company: 'Kreitech',
	location: 'Asturias, España',
	email: 'adrian.alvarezalonso1991@gmail.com',
	phone: '+34647317214',
	phoneDisplay: '+34 647 317 214',
	socials: [
		{
			id: 'github',
			label: 'GitHub',
			handle: 'N4N1T0',
			url: 'https://github.com/N4N1T0',
		},
		{
			id: 'linkedin',
			label: 'LinkedIn',
			handle: 'adrian-alvarez-alonso',
			url: 'https://www.linkedin.com/in/adrian-alvarez-alonso-front-end-developer',
		},
		{
			id: 'devto',
			label: 'dev.to',
			handle: 'n4n1t0',
			url: 'https://dev.to/n4n1t0',
		},
		{
			id: 'x',
			label: 'X',
			handle: '@AdrianlvarezAl1',
			url: 'https://x.com/AdrianlvarezAl1',
		},
	],
	// TODO(v3): these routes live in portfolio_2.0. They must exist in this repo
	// (or the old site must stay online) before this site replaces it, or the
	// links break and the indexed project pages disappear.
	sections: {
		projects: 'https://www.adrian-alvarez.com/en/projects/',
		blog: 'https://www.adrian-alvarez.com/en/blog/',
		snippets: 'https://www.adrian-alvarez.com/en/snippets/',
	},
} as const;
