import { useEffect, useRef } from 'preact/hooks';
import { animate, stagger } from 'animejs';

type Props = {
	words: string[];
};

export default function AnimatedWords({ words }: Props) {
	const list = useRef<HTMLUListElement>(null);

	useEffect(() => {
		const items = list.current ? Array.from(list.current.children) : [];
		if (items.length === 0) return;

		animate(items, {
			opacity: [0, 1],
			translateY: [18, 0],
			duration: 600,
			delay: stagger(70),
			ease: 'outQuad',
		});
	}, []);

	return (
		<ul ref={list} class="flex flex-wrap justify-center gap-x-3 gap-y-1">
			{words.map((word) => (
				<li class="opacity-0">{word}</li>
			))}
		</ul>
	);
}
