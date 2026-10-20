import type { Command } from '@/data/commands';

type Props = {
	commands: Command[];
	altLocale: { label: string; href: string };
	language: string;
	onRun: (id: string) => void;
};

export default function CommandList({ commands, altLocale, language, onRun }: Props) {
	return (
		<ul class="mt-5 divide-y divide-edge border-y border-edge font-mono text-sm">
			{commands.map((command) => (
				<li>
					<a
						href={command.href}
						onClick={(event) => {
							if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
							event.preventDefault();
							onRun(command.id);
						}}
						class="group flex min-w-0 items-baseline gap-3 px-1 py-1.5 transition-colors hover:bg-phosphor/10"
					>
						<span class="w-20 shrink-0 text-phosphor-bright group-hover:underline">
							{command.label}
						</span>
						<span class="truncate text-phosphor-dim">{command.hint}</span>
						<span class="ml-auto hidden text-phosphor-dim sm:inline">
							{command.external ? '↗' : '→'}
						</span>
					</a>
				</li>
			))}
			<li>
				<a
					href={altLocale.href}
					hreflang={altLocale.label}
					class="group flex min-w-0 items-baseline gap-3 px-1 py-1.5 transition-colors hover:bg-phosphor/10"
				>
					<span class="w-20 shrink-0 text-phosphor-bright group-hover:underline">
						{altLocale.label}
					</span>
					<span class="truncate text-phosphor-dim">{language}</span>
				</a>
			</li>
		</ul>
	);
}
