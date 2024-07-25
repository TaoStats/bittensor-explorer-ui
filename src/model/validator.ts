import { DataError } from "../utils/error";

export type ValidatorResponse = {
    height: number;
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

export type ValidatorMovingAverage = {
    address: string;
    height: number;
    normWeeklyAvg: bigint;
    norm30DayAvg: bigint;
    take: number;
    timestamp: string;
};

export type ValidatorMovingAveragePaginatedResponse = {
    hasNextPage: boolean;
    endCursor: string;
    data: ValidatorMovingAverage[];
};

export type ValidatorMovingAverageResponse = {
    loading: boolean;
    error?: DataError;
    data: ValidatorMovingAverage[];
};
