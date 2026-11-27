export type SeoProps = {
	locale: 'en' | 'es';
	title: string;
	description: string;
	ogAlt: string;
	alternateHref?: string;
	alternateLang?: 'en' | 'es';
	noindex?: boolean;
	breadcrumbs?: Array<{ name: string; href: string }>;
	blogPosting?: {
		title: string;
		description: string;
		datePublished: string;
		dateModified?: string;
		author: string;
		image?: string;
		url: string;
	};
	project?: {
		name: string;
		description: string;
		url: string;
		image?: string;
		dateCreated: string;
	};
	codeSnippet?: {
		title: string;
		description: string;
		programmingLanguage: string;
		dateCreated?: string;
		author: string;
		url: string;
	};
	collectionPage?: {
		title: string;
		description: string;
		url: string;
	};
};
