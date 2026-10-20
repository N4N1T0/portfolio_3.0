/** Session flag: the terminal boots once per visit session, not on every page. */
const BOOT_FLAG = 'terminal:booted';

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
