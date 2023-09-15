import { DataError } from "../utils/error";

export type AccountStats = {
	id: string;
	total: bigint;
	active: bigint;
	holders: bigint;
	height: bigint;
	timestamp: string;
}

export type AccountStatsPaginatedResponse = {
	hasNextPage: boolean;
	data: AccountStats[];
};

export type AccountStatsResponse = {
	loading: boolean;
	error?: DataError;
	data: AccountStats[];
};