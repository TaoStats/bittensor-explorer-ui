import { DataError } from "../utils/error";

export type Subnet = {
	id: string;
	netUid: number;
	name?: string;
	owner: string;
	extrinsicId: number;
	emission: number;
	recycled24H: bigint;
	recycledAtCreation: bigint;
	recycledByOwner: bigint;
	recycledLifetime: bigint;
	regCost: bigint;
	timestamp: string;
};

export type SingleSubnetStat = {
	id: string;
	netUid: number;
	regCost: bigint;
	activeDual: number;
	activeKeys: number;
	activeMiners: number;
	activeValidators: number;
	maxNeurons: number;
	validators: number;
};

export type SubnetHistory = {
	netUid: bigint;
	height: bigint;
	timestamp: string;
	emission: bigint;
	recycled: bigint;
	recycled24H: bigint;
};

export type SubnetHistoryPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: SubnetHistory[];
};

export type SubnetHistoryResponse = {
	loading: boolean;
	error?: DataError;
	data: SubnetHistory[];
	ids: number[];
};

export type SubnetRegCostHistory = {
	height: bigint;
	timestamp: string;
	regCost: bigint;
};

export type SubnetRegCostHistoryPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: SubnetRegCostHistory[];
};

export type SubnetRegCostHistoryResponse = {
	loading: boolean;
	error?: DataError;
	data: SubnetRegCostHistory[];
};

export type SubnetOwner = {
	id: string;
	netid: bigint;
	height: bigint;
	owner: string;
};

export type SubnetOwnerPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: SubnetOwner[];
};

export type SubnetOwnerResponse = {
	loading: boolean;
	error?: DataError;
	data: SubnetOwner[];
	ids: number[];
};

export type SubnetStat = {
	height: bigint;
	regCost: bigint;
	timestamp: string;
};

export type NeuronRegCostHistory = {
	height: bigint;
	timestamp: string;
	regCost: bigint;
	netUid: number;
};

export type NeuronRegCostHistoryPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: NeuronRegCostHistory[];
};

export type NeuronRegCostHistoryResponse = {
	loading: boolean;
	error?: DataError;
	data: NeuronRegCostHistory[];
};

export type NeuronMetagraph = {
	id: string;
	active: boolean;
	axonIp: bigint;
	axonPort: number;
	coldkey: string;
	consensus: number;
	dailyReward: bigint;
	dividends: number;
	emission: bigint;
	hotkey: string;
	incentive: number;
	isImmunityPeriod: boolean;
	lastUpdate: number;
	netUid: number;
	rank: number;
	registeredAt: bigint;
	stake: bigint;
	totalReward: bigint;
	uid: number;
	trust: number;
	validatorPermit: any;
	validatorTrust: number;
};

export type NeuronRegEvent = {
	id: string;
	uid: number;
	hotkey: string;
	coldkey: string;
	height: number;
	timestamp: string;
};

export type MinerColdKey = {
	id: string;
	coldkey: string;
	minersCount: number;
};

export type MinerColdKeyPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: MinerColdKey[];
};

export type MinerColdKeyResponse = {
	loading: boolean;
	error?: DataError;
	data: MinerColdKey[];
};

export type MinerIP = {
	id: string;
	ipAddress: string;
	minersCount: number;
};

export type MinerIPPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: MinerIP[];
};

export type MinerIPResponse = {
	loading: boolean;
	error?: DataError;
	data: MinerIP[];
};

export type MinerIncentive = {
	id: string;
	incentive: number;
	isImmunityPeriod: boolean;
};

export type MinerIncentivePaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: MinerIncentive[];
};

export type MinerIncentiveResponse = {
	loading: boolean;
	error?: DataError;
	data: MinerIncentive[];
};
