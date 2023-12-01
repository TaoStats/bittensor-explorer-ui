import { DataError } from "../utils/error";

export type Validator = {
	id: string;
	height: bigint;
	timestamp: string;
	address: string;
	amount: bigint;
	nominators: bigint;
	rank: bigint;
	amountChange: bigint;
	nominatorChange: bigint;
	owner: string;
	validatorStake: bigint;
	name?: string;
};

export type ValidatorStakeHistory = {
	amount: bigint;
	nominators: bigint;
	rank: bigint;
	timestamp: string;
};

export type ValidatorStakeHistoryPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: ValidatorStakeHistory[];
};

export type ValidatorStakeHistoryResponse = {
	loading: boolean;
	error?: DataError;
	data: ValidatorStakeHistory[];
};