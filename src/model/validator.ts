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
	take: number;
};

export type Validator = ValidatorResponse & {
	registrations: number[];
	validatorPermits: number[];
	name?: string;
};

export type ValidatorStakeHistory = {
	address: string;
	amount: bigint;
	nominators: bigint;
	totalDailyReturn: bigint;
	validatorReturn: bigint;
	nominatorReturnPerK: bigint;
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

export type ValidatorsStakeHistoryResponse = {
	loading: boolean;
	error?: DataError;
	data: {
		address: string;
		data: ValidatorStakeHistory[];
	}[];
};

export type Validator7DayMA = {
	address: bigint;
	height: number;
	normWeeklyAvg: bigint;
	take: number;
	timestamp: string;
};

export type Validator7DayMAPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: Validator7DayMA[];
};

export type Validator7DayMAResponse = {
	loading: boolean;
	error?: DataError;
	data: Validator7DayMA[];
};
