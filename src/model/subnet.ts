import { DataError } from "../utils/error";

export type Subnet = {
	id: string;
	netUid: number;
	name?: string;
	createdAt: bigint;
	owner: string;
	extrinsicId: number;
	emission: number;
	raoRecycled: bigint;
	raoRecycled24H: bigint;
	timestamp: string;
};

export type SubnetEmissionsHistory = {
	subnetId: bigint;
	height: bigint;
	timestamp: string;
	emission: bigint;
};

export type SubnetEmissionsHistoryPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: SubnetEmissionsHistory[];
};

export type SubnetEmissionsHistoryResponse = {
	loading: boolean;
	error?: DataError;
	data: SubnetEmissionsHistory[];
};
