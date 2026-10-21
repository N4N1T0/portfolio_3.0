import { useEffect } from 'preact/hooks';

type Props = {
	entries: Array<{ number: number; label: string; href: string }>;
};

/** Guarda las entradas numeradas de la página actual en sessionStorage y
 *  notifica a ShellPrompt para que las lea. Se remonta en cada navegación de
 *  página (SPA), así que siempre refleja la página visible. */
export default function NumericNavSetter({ entries }: Props) {
	useEffect(() => {
		sessionStorage.setItem('terminal:numeric-nav', JSON.stringify({ numericEntries: entries }));
		window.dispatchEvent(new CustomEvent('terminal:numeric-nav'));
	}, [entries]);
	return null;
}
