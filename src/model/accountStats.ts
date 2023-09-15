export type AccountStats = {
	id: string;
	total: bigint;
	active: bigint;
	holders: bigint;
	height: bigint;
	timestamp: string;
}

export type AccountStatsResponse = {
	hasNextPage: boolean;
	data: AccountStats[];
};