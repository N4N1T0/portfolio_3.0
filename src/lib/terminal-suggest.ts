/** The completion an IDE would offer for what has been typed so far. */
export function suggestCompletion(value: string, commandIds: string[]): string {
	const query = value.trim().toLowerCase();
	if (!query) return '';
	const match = [...commandIds, 'help'].find((id) => id.startsWith(query) && id !== query);
	return match ? match.slice(query.length) : '';
}
