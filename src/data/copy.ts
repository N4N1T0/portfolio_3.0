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
		historyLabel: string;
		pathLabel: string;
	};
	language: string;
	newTab: string;
	error: {
		title: string;
		description: string;
		heading: string;
		message: string;
		hint: string;
		home: string;
		blog: string;
	};
	collections: {
		projectsTitle: string;
		projectsSubtitle: string;
		projectsNote: string;
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
		updated: string;
		related: string;
		home: string;
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
		starwind: string;
		tiptap: string;
		present: string;
		commits: string;
	};
	footer: {
		copyright: string;
		stack: string;
		build: string;
		license: string;
	};
	help: {
		title: string;
		pages: string;
		commands: string;
		close: string;
		language: string;
		items: { id: string; hint: string }[];
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

const fullstackTyping = (prefix: string, suffix: string) =>
	[
		{ type: 'type', text: prefix },
		{ type: 'type', text: 'Frontend' },
		{ type: 'wait', ms: 620 },
		{ type: 'erase', text: 'Frontend' },
		{ type: 'wait', ms: 240 },
		{ type: 'type', text: 'Backend' },
		{ type: 'wait', ms: 620 },
		{ type: 'erase', text: 'Backend' },
		{ type: 'wait', ms: 240 },
		{ type: 'type', text: 'Fullstack' },
		{ type: 'type', text: suffix },
	] satisfies LineScript;

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
			fullstackTyping('Senior ', ' Engineer'),
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
			historyLabel: 'history',
			pathLabel: 'path',
		},
		language: 'Spanish',
		newTab: 'new tab',
		error: {
			title: '404 · page not found',
			description: 'That route does not exist. Start again from the terminal home.',
			heading: 'PAGE NOT FOUND',
			message: 'The path you asked for is not in this filesystem.',
			hint: 'ctrl-b lists every page and command',
			home: 'cd ~',
			blog: 'ls blog',
		},
		collections: {
			projectsTitle: 'Projects',
			projectsSubtitle:
				'Product and platform work in production: eCommerce, APIs, data and interfaces.',
			projectsNote:
				'There are more projects I built under different agencies that I cannot publish for privacy reasons. If you need more information, I can walk you through them or send the details.',
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
			updated: 'updated',
			related: 'related entries',
			home: 'home',
		},
		about: {
			title: 'About',
			subtitle: 'Who I am, what I have built and what I work with.',
			profile: '$ cat about.txt',
			whoami: '$ whoami',
			experience: '$ cat experience.log',
			stack: '$ cat stack.txt',
			certifications: '$ cat certifications.txt',
			contributions: 'Contribuciones en open source',
			starwind: 'Starwind UI',
			tiptap: 'tiptap-shadcn',
			present: 'present',
			commits: 'commits in 2026',
		},
		footer: {
			copyright: '© 2026 Adrián Álvarez',
			stack: 'ASTRO 7 · TAILWIND 4 · PREACT 11',
			build: 'build',
			license: 'MIT',
		},
		help: {
			title: 'HELP',
			pages: 'PAGES',
			commands: 'COMMANDS',
			close: 'esc to close',
			language: 'LANGUAGE',
			items: [
				{ id: 'help / ls', hint: 'list everything' },
				{ id: 'cd <page>', hint: 'go to a page' },
				{ id: 'cd ~', hint: 'go home' },
				{ id: 'cd -', hint: 'go back' },
				{ id: 'history', hint: 'what you already ran' },
				{ id: 'pwd', hint: 'current path' },
				{ id: 'clear', hint: 'clean the output' },
			],
		},
		commands: [
			{ id: 'about', hint: 'who I am', external: false },
			{ id: 'cv', hint: 'download my CV (PDF)', external: false },
			{ id: 'projects', hint: 'case studies', external: false },
			{ id: 'blog', hint: 'writing', external: false },
			{ id: 'snippets', hint: 'small components', external: false },
			{ id: 'github', hint: 'source code', external: true },
			{ id: 'linkedin', hint: 'profile', external: true },

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
			fullstackTyping('Ingeniero ', ' Senior'),
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
			historyLabel: 'historial',
			pathLabel: 'ruta',
		},
		language: 'inglés',
		newTab: 'pestaña nueva',
		error: {
			title: '404 · página no encontrada',
			description: 'Esa ruta no existe. Vuelve a empezar desde la terminal.',
			heading: 'PÁGINA NO ENCONTRADA',
			message: 'La ruta que has pedido no está en este sistema de archivos.',
			hint: 'ctrl-b lista todas las páginas y comandos',
			home: 'cd ~',
			blog: 'ls blog',
		},
		collections: {
			projectsTitle: 'Proyectos',
			projectsSubtitle:
				'Producto y plataformas en producción: eCommerce, APIs, datos e interfaces.',
			projectsNote:
				'Hay más proyectos que hice bajo distintas agencias y que no puedo publicar por privacidad. Si necesitas más información, te los cuento o te envío los detalles.',
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
			updated: 'actualizado',
			related: 'entradas relacionadas',
			home: 'inicio',
		},
		about: {
			title: 'Sobre mí',
			subtitle: 'Quién soy, qué he construido y con qué trabajo.',
			profile: '$ cat about.txt',
			whoami: '$ whoami',
			experience: '$ cat experience.log',
			stack: '$ cat stack.txt',
			certifications: '$ cat certifications.txt',
			contributions: 'Contribuciones en código abierto',
			starwind: 'Starwind UI',
			tiptap: 'tiptap-shadcn',
			present: 'actualidad',
			commits: 'commits en 2026',
		},
		footer: {
			copyright: '© 2026 Adrián Álvarez',
			stack: 'ASTRO 7 · TAILWIND 4 · PREACT 11',
			build: 'build',
			license: 'MIT',
		},
		help: {
			title: 'AYUDA',
			pages: 'PÁGINAS',
			commands: 'COMANDOS',
			close: 'esc para cerrar',
			language: 'IDIOMA',
			items: [
				{ id: 'help / ls', hint: 'listar todo' },
				{ id: 'cd <página>', hint: 'ir a una página' },
				{ id: 'cd ~', hint: 'ir al inicio' },
				{ id: 'cd -', hint: 'volver atrás' },
				{ id: 'history', hint: 'lo que ya ejecutaste' },
				{ id: 'pwd', hint: 'ruta actual' },
				{ id: 'clear', hint: 'limpiar la salida' },
			],
		},
		commands: [
			{ id: 'about', hint: 'quién soy', external: false },
			{ id: 'cv', hint: 'descargar mi CV (PDF)', external: false },
			{ id: 'projects', hint: 'casos de estudio', external: false },
			{ id: 'blog', hint: 'escritos', external: false },
			{ id: 'snippets', hint: 'componentes pequeños', external: false },
			{ id: 'github', hint: 'código fuente', external: true },
			{ id: 'linkedin', hint: 'perfil', external: true },

			{ id: 'email', hint: 'adrian.alvarezalonso1991@gmail.com', external: false },
		],
		a11y: {
			loader: 'Cargando el portfolio',
			commands: 'Comandos disponibles',
			output: 'Salida de la terminal',
		},
	},
};
