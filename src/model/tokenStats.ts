import { DataError } from "../utils/error";

export type TokenStats = {
	id: string;
	totalIssuance: bigint;
	totalStake: bigint;
	timestamp: string;
}

export type TokenStatsPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: TokenStats[];
};

export type TokenStatsResponse = {
	loading: boolean;
	error?: DataError;
	data: TokenStats[];
};