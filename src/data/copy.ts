import type { LineScript } from '@/lib/terminal-typing';

export type Locale = 'en' | 'es';

export type Copy = {
	lang: string;
	meta: {
		title: string;
		description: string;
		ogAlt: string;
	};
	boot: {
		heading: string;
		lines: string[];
	};
	lines: LineScript[];
	prompt: {
		label: string;
		placeholder: string;
		help: string;
		accept: string;
		notFound: string;
		commandsLabel: string;
	};
	language: string;
	newTab: string;
	collections: {
		projectsTitle: string;
		projectsSubtitle: string;
		blogTitle: string;
		blogSubtitle: string;
		snippetsTitle: string;
		snippetsSubtitle: string;
		back: string;
		live: string;
		stack: string;
		challenge: string;
		solution: string;
		testimonial: string;
		try: string;
		entries: string;
		published: string;
	};
	about: {
		title: string;
		subtitle: string;
		profile: string;
		whoami: string;
		experience: string;
		stack: string;
		certifications: string;
		contributions: string;
		present: string;
		commits: string;
	};
	footer: {
		copyright: string;
		stack: string;
		build: string;
		license: string;
	};
	commands: {
		id: string;
		hint: string;
		external: boolean;
	}[];
	a11y: {
		loader: string;
		commands: string;
		output: string;
	};
};

export const copy: Record<Locale, Copy> = {
	en: {
		lang: 'en',
		meta: {
			title: 'Adrián Álvarez — Senior Fullstack Engineer',
			description:
				'Portfolio of Adrián Álvarez, senior fullstack engineer. I build APIs, interfaces and data systems in production.',
			ogAlt: 'Adrián Álvarez — senior fullstack engineer, terminal portfolio',
		},
		boot: {
			heading: 'ADRIAN-ALVAREZ PORTFOLIO TERMINAL v3.0',
			lines: [
				'(C) 2026 ADRIAN ALVAREZ. ALL RIGHTS RESERVED.',
				'CPU 6502 @ 2.80MHz ........ OK',
				'RAM 64K ................... OK',
				'LOADING PROFILE ........... OK',
			],
		},
		lines: [
			[{ type: 'type', text: "Adrián 'Nano' Álvarez Alonso" }],
			[
				{ type: 'type', text: 'Senior ' },
				{ type: 'type', text: 'Frontend' },
				{ type: 'wait', ms: 340 },
				{ type: 'erase', text: 'Frontend' },
				{ type: 'type', text: 'Backend' },
				{ type: 'wait', ms: 340 },
				{ type: 'erase', text: 'Backend' },
				{ type: 'type', text: 'Fullstack' },
				{ type: 'type', text: ' Engineer' },
			],
			[{ type: 'type', text: 'I build APIs, interfaces and data systems in production.' }],
			[],
			[{ type: 'type', text: 'Fullstack Engineer at Kreitech · Asturias, España' }],
		],
		prompt: {
			label: 'Terminal command',
			placeholder: 'type a command…',
			help: 'type help for the list',
			accept: 'tab to accept',
			notFound: 'command not found: {id}. type help for the list',
			commandsLabel: 'commands',
		},
		language: 'Spanish',
		newTab: 'new tab',
		collections: {
			projectsTitle: 'Projects',
			projectsSubtitle:
				'Product and platform work in production: eCommerce, APIs, data and interfaces.',
			blogTitle: 'Blog',
			blogSubtitle: 'Notes on Astro, eCommerce, performance and engineering practice.',
			snippetsTitle: 'Snippets',
			snippetsSubtitle: 'Small components and experiments, ready to copy.',
			back: 'back to the terminal',
			live: 'live site',
			stack: 'stack',
			challenge: 'challenge',
			solution: 'solution',
			testimonial: 'testimonial',
			try: 'try it',
			entries: 'entries',
			published: 'published',
		},
		about: {
			title: 'About',
			subtitle: 'Who I am, what I have built and what I work with.',
			profile: '$ cat about.txt',
			whoami: '$ whoami',
			experience: '$ cat experience.log',
			stack: '$ cat stack.txt',
			certifications: '$ cat certifications.txt',
			contributions: '$ git log --since=2026-01-01 --oneline',
			present: 'present',
			commits: 'commits in 2026',
		},
		footer: {
			copyright: '© 2026 Adrián Álvarez',
			stack: 'ASTRO 7 · TAILWIND 4 · PREACT 11',
			build: 'build',
			license: 'MIT',
		},
		commands: [
			{ id: 'about', hint: 'who I am', external: false },
			{ id: 'projects', hint: 'case studies', external: false },
			{ id: 'blog', hint: 'writing', external: false },
			{ id: 'snippets', hint: 'small components', external: false },
			{ id: 'github', hint: 'source code', external: true },
			{ id: 'linkedin', hint: 'profile', external: true },
			{ id: 'devto', hint: 'articles', external: true },
			{ id: 'email', hint: 'adrian.alvarezalonso1991@gmail.com', external: false },
		],
		a11y: {
			loader: 'Loading the portfolio',
			commands: 'Available commands',
			output: 'Terminal output',
		},
	},
	es: {
		lang: 'es',
		meta: {
			title: 'Adrián Álvarez — Ingeniero Fullstack Senior',
			description:
				'Portfolio de Adrián Álvarez, ingeniero fullstack senior. Construyo APIs, interfaces y sistemas de datos en producción.',
			ogAlt: 'Adrián Álvarez — ingeniero fullstack senior, portfolio terminal',
		},
		boot: {
			heading: 'TERMINAL PORTFOLIO ADRIAN-ALVAREZ v3.0',
			lines: [
				'(C) 2026 ADRIAN ALVAREZ. TODOS LOS DERECHOS RESERVADOS.',
				'CPU 6502 @ 2.80MHz ........ OK',
				'RAM 64K ................... OK',
				'CARGANDO PERFIL ........... OK',
			],
		},
		lines: [
			[{ type: 'type', text: "Adrián 'Nano' Álvarez Alonso" }],
			[
				{ type: 'type', text: 'Ingeniero ' },
				{ type: 'type', text: 'Frontend' },
				{ type: 'wait', ms: 340 },
				{ type: 'erase', text: 'Frontend' },
				{ type: 'type', text: 'Backend' },
				{ type: 'wait', ms: 340 },
				{ type: 'erase', text: 'Backend' },
				{ type: 'type', text: 'Fullstack' },
				{ type: 'type', text: ' Senior' },
			],
			[{ type: 'type', text: 'Construyo APIs, interfaces y sistemas de datos en producción.' }],
			[],
			[{ type: 'type', text: 'Ingeniero Fullstack en Kreitech · Asturias, España' }],
		],
		prompt: {
			label: 'Comando de terminal',
			placeholder: 'escribe un comando…',
			help: 'escribe help para ver la lista',
			accept: 'tab para aceptar',
			notFound: 'comando no encontrado: {id}. escribe help para ver la lista',
			commandsLabel: 'comandos',
		},
		language: 'inglés',
		newTab: 'pestaña nueva',
		collections: {
			projectsTitle: 'Proyectos',
			projectsSubtitle:
				'Producto y plataformas en producción: eCommerce, APIs, datos e interfaces.',
			blogTitle: 'Blog',
			blogSubtitle: 'Notas sobre Astro, eCommerce, rendimiento y práctica de ingeniería.',
			snippetsTitle: 'Snippets',
			snippetsSubtitle: 'Componentes y experimentos pequeños, listos para copiar.',
			back: 'volver a la terminal',
			live: 'sitio en vivo',
			stack: 'stack',
			challenge: 'reto',
			solution: 'solución',
			testimonial: 'testimonio',
			try: 'pruébalo',
			entries: 'entradas',
			published: 'publicado',
		},
		about: {
			title: 'Sobre mí',
			subtitle: 'Quién soy, qué he construido y con qué trabajo.',
			profile: '$ cat about.txt',
			whoami: '$ whoami',
			experience: '$ cat experience.log',
			stack: '$ cat stack.txt',
			certifications: '$ cat certifications.txt',
			contributions: '$ git log --since=2026-01-01 --oneline',
			present: 'actualidad',
			commits: 'commits en 2026',
		},
		footer: {
			copyright: '© 2026 Adrián Álvarez',
			stack: 'ASTRO 7 · TAILWIND 4 · PREACT 11',
			build: 'build',
			license: 'MIT',
		},
		commands: [
			{ id: 'about', hint: 'quién soy', external: false },
			{ id: 'projects', hint: 'casos de estudio', external: false },
			{ id: 'blog', hint: 'escritos', external: false },
			{ id: 'snippets', hint: 'componentes pequeños', external: false },
			{ id: 'github', hint: 'código fuente', external: true },
			{ id: 'linkedin', hint: 'perfil', external: true },
			{ id: 'devto', hint: 'artículos', external: true },
			{ id: 'email', hint: 'adrian.alvarezalonso1991@gmail.com', external: false },
		],
		a11y: {
			loader: 'Cargando el portfolio',
			commands: 'Comandos disponibles',
			output: 'Salida de la terminal',
		},
	},
};
