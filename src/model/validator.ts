import { DataError } from "../utils/error";

export type ValidatorResponse = {
	address: string;
	amount: bigint;
	amountChange: bigint;
	id: string;
	nominatorChange: bigint;
	nominatorReturnPerK: bigint;
	nominators: bigint;
	owner: string;
	totalDailyReturn: bigint;
	validatorStake: bigint;
	validatorReturn: bigint;
	registrations: string;
	validatorPermits: string;
};

export type Validator = ValidatorResponse & {
	registrations: number[];
	validatorPermits: number[];
	name?: string;
}

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