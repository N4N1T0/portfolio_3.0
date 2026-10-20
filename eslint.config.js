import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
	{
		ignores: [
			'dist/**',
			'.astro/**',
			'.vercel/**',
			'node_modules/**',
			'public/**',
			'coverage/**',
			'.agents/**',
			'.opencode/**',
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...astro.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['../../**', '../*/../*', '../*/../**'],
							message: 'Deep relative import. Use the @/ alias instead.',
						},
					],
				},
			],
		},
	},
	prettier,
);
