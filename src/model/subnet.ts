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

export type SubnetHistory = {
	subnetId: bigint;
	height: bigint;
	timestamp: string;
	emission: bigint;
	raoRecycled: bigint;
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
