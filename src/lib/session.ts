/** Session flag: the terminal boots once per visit session, not on every page. */
const BOOT_FLAG = 'terminal:booted';

/** The commands already run in this session, like the bash history. */
const HISTORY_KEY = 'terminal:history';

export function hasBooted(): boolean {
	try {
		return sessionStorage.getItem(BOOT_FLAG) !== null;
	} catch {
		return false;
	}
}

export function markBooted(): void {
	try {
		sessionStorage.setItem(BOOT_FLAG, '1');
	} catch {
		// private mode: the boot plays again, nothing else breaks
	}
}

export function readHistory(): string[] {
	try {
		const raw = sessionStorage.getItem(HISTORY_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === 'string') : [];
	} catch {
		return [];
	}
}

export function pushHistory(entry: string): void {
	try {
		const history = readHistory().filter((item) => item !== entry);
		history.push(entry);
		sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-50)));
	} catch {
		// private mode: the history does not survive the page
	}
}
