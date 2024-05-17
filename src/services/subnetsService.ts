import {
	Subnet,
	SubnetHistory,
	SubnetOwner,
	SubnetHistoryPaginatedResponse,
	SubnetOwnerPaginatedResponse,
	SubnetRegCostHistory,
	SubnetRegCostHistoryPaginatedResponse,
	SubnetStat,
	NeuronRegCostHistory,
	NeuronRegCostHistoryPaginatedResponse,
	NeuronMetagraph,
	NeuronRegEvent,
	SingleSubnetStat,
	MinerColdKeyPaginatedResponse,
	MinerColdKey,
	MinerIP,
	MinerIPPaginatedResponse,
	MinerIncentive,
	MinerIncentivePaginatedResponse,
	SubnetHyperparams,
	NeuronPerformance,
	NeuronPerformancePaginatedResponse,
	NeuronDeregistration,
	NeuronDeregistrationPaginatedResponse,
	RootValidator,
	ColdkeySubnetPaginatedResponse,
	ColdkeyInfo,
	ColdkeyInfoPaginatedResponse,
} from "../model/subnet";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import subnetsJson from "../subnets.json";
import { extractItems } from "../utils/extractItems";
import { fetchIndexer, fetchSubnets } from "./fetchService";

export type SubnetsFilter = object;
export type SubnetHyperparamsFilter = object;
export type SingleSubnetStatsFilter = object;
export type NeuronMetagraphFilter = object;
export type RootValidatorFilter = object;
export type NeuronPerformanceFilter = object;
export type NeuronRegEventsFilter = object;

export type SubnetsOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "NET_UID_ASC"
	| "NET_UID_DESC"
	| "EMISSION_ASC"
	| "EMISSION_DESC"
	| "RAO_RECYCLED_ASC"
	| "RAO_RECYCLED_DESC"
	| "RAO_RECYCLED24H_ASC"
	| "RAO_RECYCLED24H_DESC"
	| "TIMESTAMP_ASC"
	| "TIMESTAMP_DESC";

export type SubnetHistoryOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "HEIGHT_ASC"
	| "HEIGHT_DESC";

export type NeuronHistoryOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "HEIGHT_ASC"
	| "HEIGHT_DESC";

export type SubnetOwnerOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "HEIGHT_ASC"
	| "HEIGHT_DESC";

export type NeuronMetagraphOrder =
	| "ACTIVE_ASC"
	| "ACTIVE_DESC"
	| "AXON_IP_ASC"
	| "AXON_IP_DESC"
	| "AXON_PORT_ASC"
	| "AXON_PORT_DESC"
	| "COLDKEY_ASC"
	| "COLDKEY_DESC"
	| "CONSENSUS_ASC"
	| "CONSENSUS_DESC"
	| "DAILY_REWARD_ASC"
	| "DAILY_REWARD_DESC"
	| "DIVIDENDS_ASC"
	| "DIVIDENDS_DESC"
	| "EMISSION_ASC"
	| "EMISSION_DESC"
	| "HOTKEY_ASC"
	| "HOTKEY_DESC"
	| "ID_ASC"
	| "ID_DESC"
	| "INCENTIVE_ASC"
	| "INCENTIVE_DESC"
	| "LAST_UPDATE_ASC"
	| "LAST_UPDATE_DESC"
	| "NET_UID_ASC"
	| "NET_UID_DESC"
	| "RANK_ASC"
	| "RANK_DESC"
	| "STAKE_ASC"
	| "STAKE_DESC"
	| "TRUST_ASC"
	| "TRUST_DESC"
	| "UID_ASC"
	| "UID_DESC"
	| "VALIDATOR_PERMIT_ASC"
	| "VALIDATOR_PERMIT_DESC"
	| "VALIDATOR_TRUST_ASC"
	| "VALIDATOR_TRUST_DESC";

export type RootValidatorOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "HOTKEY_ASC"
	| "HOTKEY_DESC"
	| "STAKE_ASC"
	| "STAKE_DESC"
	| "UID_ASC"
	| "UID_DESC";

export type NeuronPerformanceOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "HEIGHT_ASC"
	| "HEIGHT_DESC";

export type NeuronRegEventsOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "HOTKEY_ASC"
	| "HOTKEY_DESC"
	| "COLDKEY_ASC"
	| "COLDKEY_DESC"
	| "UID_ASC"
	| "UID_DESC"
	| "HEIGHT_ASC"
	| "HEIGHT_DESC"
	| "TIMESTAMP_ASC"
	| "TIMESTAMP_DESC";

export type MinerColdkeyOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "MINERS_COUNT_ASC"
	| "MINERS_COUNT_DESC";

export type MinerIPOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "MINERS_COUNT_ASC"
	| "MINERS_COUNT_DESC";

export type MinerIncentiveOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "INCENTIVE_ASC"
	| "INCENTIVE_DESC";

export async function getSubnet(filter: SubnetsFilter | undefined) {
	const response = await fetchSubnets<{ subnets: ResponseItems<Subnet> }>(
		`query ($filter: SubnetFilter) {
			subnets(first: 1, offset: 0, filter: $filter, orderBy: ID_DESC) {
				nodes {
					id
					netUid
					owner
					extrinsicId
					emission
					recycled24H
					recycledAtCreation
					recycledByOwner
					recycledLifetime
					timestamp
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				totalCount
			}
		}`,
		{
			filter,
		}
	);

	const data = extractItems(
		response.subnets,
		{ limit: 1 },
		addSubnetName,
		subnetsJson
	);

	return data.data[0];
}

export async function getSubnets(
	filter: SubnetsFilter | undefined,
	order: SubnetsOrder = "NET_UID_ASC",
	pagination: PaginationOptions
) {
	const response = await fetchSubnets<{ subnets: ResponseItems<Subnet> }>(
		`query ($filter: SubnetFilter, $order: [SubnetsOrderBy!]!) {
			subnets(filter: $filter, orderBy: $order) {
				nodes {
					id
					netUid
					owner
					extrinsicId
					emission
					recycled24H
					recycledAtCreation
					recycledByOwner
					recycledLifetime
					timestamp
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				totalCount
			}
		}`,
		{
			filter,
			order,
		}
	);

	return extractItems(response.subnets, pagination, addSubnetName, subnetsJson);
}

export async function getSubnetHyperparams(
	filter: SubnetHyperparamsFilter | undefined
) {
	const response = await fetchSubnets<{
		subnetHyperparams: ResponseItems<SubnetHyperparams>;
	}>(
		`query ($filter: SubnetHyperparamFilter) {
			subnetHyperparams(filter: $filter) {
				nodes {
					id
					activityCutoff
					adjustmentAlpha
					adjustmentInterval
					bondsMovingAvg
					difficulty
					immunityPeriod
					kappa
					lastUpdate
					maxBurn
					maxDifficulty
					maxRegsPerBlock
					maxValidators
					minAllowedWeights
					maxWeightsLimit
					minBurn
					minDifficulty
					registrationAllowed
					rho
					servingRateLimit
					targetRegsPerInterval
					tempo
					timestamp
					weightsRateLimit
					weightsVersion
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				totalCount
			}
		}`,
		{
			filter,
		}
	);

	const data = extractItems(
		response.subnetHyperparams,
		{ limit: 1 },
		transform
	);
	return data.data[0];
}

export async function getSubnetHistory(
	filter?: object,
	order: SubnetHistoryOrder = "ID_ASC",
	after?: string
): Promise<SubnetHistoryPaginatedResponse> {
	const response = await fetchSubnets<{
		subnetHistoricals: ResponseItems<SubnetHistory>;
	}>(
		`query($filter: SubnetHistoricalFilter, $order: [SubnetHistoricalsOrderBy!]!, $after: Cursor) {
			subnetHistoricals(filter: $filter, orderBy: $order, after: $after) {
				nodes {
					id
					netUid
					height
					emission
					recycled
					recycled24H
					timestamp
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}`,
		{
			after,
			filter,
			order,
		}
	);

	return {
		hasNextPage: response.subnetHistoricals?.pageInfo.hasNextPage,
		endCursor: response.subnetHistoricals?.pageInfo.endCursor,
		data: response.subnetHistoricals?.nodes,
	};
}

export async function getSubnetRegCostHistory(
	filter?: object,
	order: SubnetHistoryOrder = "ID_ASC",
	after?: string
): Promise<SubnetRegCostHistoryPaginatedResponse> {
	const response = await fetchSubnets<{
		subnetRegHistoricals: ResponseItems<SubnetRegCostHistory>;
	}>(
		`query($filter: SubnetRegHistoricalFilter, $order: [SubnetRegHistoricalsOrderBy!]!, $after: Cursor) {
			subnetRegHistoricals(filter: $filter, orderBy: $order, after: $after) {
				nodes {
					id
					height
					regCost
					timestamp
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			  }
		}`,
		{
			after,
			filter,
			order,
		}
	);

	return {
		hasNextPage: response.subnetRegHistoricals?.pageInfo.hasNextPage,
		endCursor: response.subnetRegHistoricals?.pageInfo.endCursor,
		data: response.subnetRegHistoricals?.nodes,
	};
}

export async function getNeuronRegCostHistory(
	filter?: object,
	order: NeuronHistoryOrder = "ID_ASC",
	after?: string
): Promise<NeuronRegCostHistoryPaginatedResponse> {
	const response = await fetchSubnets<{
		neuronRegHistoricals: ResponseItems<NeuronRegCostHistory>;
	}>(
		`query($filter: NeuronRegHistoricalFilter, $order: [NeuronRegHistoricalsOrderBy!]!, $after: Cursor) {
			neuronRegHistoricals(filter: $filter, orderBy: $order, after: $after) {
				nodes {
					id
					height
					regCost
					timestamp
					netUid
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}`,
		{
			after,
			filter,
			order,
		}
	);

	return {
		hasNextPage: response.neuronRegHistoricals?.pageInfo.hasNextPage,
		endCursor: response.neuronRegHistoricals?.pageInfo.endCursor,
		data: response.neuronRegHistoricals?.nodes,
	};
}

export async function getNeuronDeregistration(
	filter?: object,
	order: NeuronHistoryOrder = "ID_ASC",
	after?: string
): Promise<NeuronDeregistrationPaginatedResponse> {
	const response = await fetchSubnets<{
		neuronDeregistrations: ResponseItems<NeuronDeregistration>;
	}>(
		`query($filter: NeuronDeregistrationFilter, $order: [NeuronDeregistrationsOrderBy!]!, $after: Cursor) {
			neuronDeregistrations(filter: $filter, orderBy: $order, after: $after) {
				nodes {
					id
					height
					emission
					incentive
					timestamp
					netUid
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}`,
		{
			after,
			filter,
			order,
		}
	);

	return {
		hasNextPage: response.neuronDeregistrations?.pageInfo.hasNextPage,
		endCursor: response.neuronDeregistrations?.pageInfo.endCursor,
		data: response.neuronDeregistrations?.nodes,
	};
}

export async function getSubnetOwners(
	filter?: object,
	order: SubnetOwnerOrder = "ID_ASC",
	after?: string
): Promise<SubnetOwnerPaginatedResponse> {
	const response = await fetchSubnets<{
		subnetOwners: ResponseItems<SubnetOwner>;
	}>(
		`query($filter: SubnetOwnerFilter, $order: [SubnetOwnersOrderBy!]!, $after: Cursor) {
			subnetOwners(filter: $filter, orderBy: $order, after: $after) {
				nodes {
					id
					netid
					height
					owner
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			  }
		}`,
		{
			after,
			filter,
			order,
		}
	);

	return {
		hasNextPage: response.subnetOwners?.pageInfo.hasNextPage,
		endCursor: response.subnetOwners?.pageInfo.endCursor,
		data: response.subnetOwners?.nodes,
	};
}

export async function getSubnetStat(id: string) {
	const response = await fetchSubnets<{ subnetStat: SubnetStat }>(
		`query ($id: String!) {
			subnetStat(id: $id) {
				height
				id
				regCost
				timestamp
			}
		}`,
		{
			id,
		}
	);

	return response.subnetStat;
}

export async function getNeuronMetagraph(
	filter: NeuronMetagraphFilter | undefined,
	order: NeuronMetagraphOrder = "ID_DESC",
	pagination: PaginationOptions
) {
	const response = await fetchSubnets<{
		neuronInfos: ResponseItems<NeuronMetagraph>;
	}>(
		`query ($first: Int!, $offset: Int!, $filter: NeuronInfoFilter, $order: [NeuronInfosOrderBy!]!) {
			neuronInfos(first: $first, offset: $offset, filter: $filter, orderBy: $order) {
				nodes {
					id
					active
					axonIp
					axonPort
					coldkey
					consensus
					dailyReward
					dividends
					emission
					hotkey
					incentive
					isImmunityPeriod
					updated
					netUid
					rank
					registeredAt
					stake
					uid
					trust
					validatorPermit
					validatorTrust
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				totalCount
			}
		}`,
		{
			offset: (pagination.offset ?? 1) - 1,
			first: pagination.limit,
			filter,
			order,
		}
	);

	return extractItems(response.neuronInfos, pagination, transform);
}

export async function getRootValidators(
	filter: RootValidatorFilter | undefined,
	order: RootValidatorOrder = "ID_DESC",
	pagination: PaginationOptions
) {
	const response = await fetchIndexer<{
		rootValidators: ResponseItems<RootValidator>;
	}>(
		`query ($first: Int!, $offset: Int!, $filter: RootValidatorFilter, $order: [RootValidatorsOrderBy!]!) {
			rootValidators(first: $first, offset: $offset, filter: $filter, orderBy: $order) {
				nodes {
					id
					uid
					hotkey
					stake
					weights
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				totalCount
			}
		}`,
		{
			offset: (pagination.offset ?? 1) - 1,
			first: pagination.limit,
			filter,
			order,
		}
	);

	return extractItems(response.rootValidators, pagination, transform);
}

export async function getNeuronPerformance(
	filter: NeuronPerformanceFilter | undefined,
	order: NeuronPerformanceOrder = "ID_DESC",
	after?: string
): Promise<NeuronPerformancePaginatedResponse> {
	const response = await fetchSubnets<{
		neuronPerformances: ResponseItems<NeuronPerformance>;
	}>(
		`query ($after: Cursor, $filter: NeuronPerformanceFilter, $order: [NeuronPerformancesOrderBy!]!) {
			neuronPerformances(after: $after, filter: $filter, orderBy: $order) {
				nodes {
					id
					emission
					height
					timestamp
					updated
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				totalCount
			}
		}`,
		{
			after,
			filter,
			order,
		}
	);

	return {
		hasNextPage: response.neuronPerformances?.pageInfo.hasNextPage,
		endCursor: response.neuronPerformances?.pageInfo.endCursor,
		data: response.neuronPerformances?.nodes,
	};
}

export async function getNeuronRegEvents(
	filter: NeuronRegEventsFilter | undefined,
	order: NeuronRegEventsOrder = "ID_DESC",
	pagination: PaginationOptions
) {
	const response = await fetchSubnets<{
		neuronRegEvents: ResponseItems<NeuronRegEvent>;
	}>(
		`query ($first: Int!, $after: Cursor, $filter: NeuronRegEventFilter, $order: [NeuronRegEventsOrderBy!]!) {
			neuronRegEvents(first: $first, after: $after, filter: $filter, orderBy: $order) {
				nodes {
					id
					uid
					hotkey
					coldkey
					height
					timestamp
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				totalCount
			}
		}`,
		{
			after: pagination.after,
			first: pagination.limit,
			filter,
			order,
		}
	);

	return extractItems(response.neuronRegEvents, pagination, transform);
}

export async function getSingleSubnetStat(
	filter: SingleSubnetStatsFilter | undefined
) {
	const response = await fetchSubnets<{
		singleSubnetStats: ResponseItems<SingleSubnetStat>;
	}>(
		`query ($filter: SingleSubnetStatFilter) {
			singleSubnetStats(first: 1, offset: 0, filter: $filter, orderBy: ID_DESC) {
				nodes {
					id
					activeDual
					activeKeys
					activeMiners
					activeValidators
					maxNeurons
					netUid
					regCost
					validators
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				totalCount
			}
		}`,
		{
			filter,
		}
	);

	const data = extractItems(
		response.singleSubnetStats,
		{ limit: 1 },
		transform
	);

	return data.data[0];
}

export async function getMinerColdkeys(
	filter?: object,
	order: MinerColdkeyOrder = "ID_ASC",
	after?: string
): Promise<MinerColdKeyPaginatedResponse> {
	const response = await fetchSubnets<{
		minerColdkeys: ResponseItems<MinerColdKey>;
	}>(
		`query($filter: MinerColdkeyFilter, $order: [MinerColdkeysOrderBy!]!, $after: Cursor) {
			minerColdkeys(filter: $filter, orderBy: $order, after: $after) {
				nodes {
					id
					coldkey
					minersCount
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}`,
		{
			after,
			filter,
			order,
		}
	);

	return {
		hasNextPage: response.minerColdkeys?.pageInfo.hasNextPage,
		endCursor: response.minerColdkeys?.pageInfo.endCursor,
		data: response.minerColdkeys?.nodes,
	};
}

export async function getPaginatedMinerColdkeys(
	filter: object,
	order: MinerColdkeyOrder = "ID_DESC",
	pagination: PaginationOptions
) {
	const response = await fetchSubnets<{
		minerColdkeys: ResponseItems<MinerColdKey>;
	}>(
		`query($filter: MinerColdkeyFilter, $order: [MinerColdkeysOrderBy!]!, $after: Cursor, $first: Int!) {
			minerColdkeys(filter: $filter, orderBy: $order, after: $after, first: $first) {
				nodes {
					id
					coldkey
					minersCount
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				${pagination.after === undefined ? "totalCount" : ""}
			}
		}`,
		{
			after: pagination.after,
			first: pagination.limit,
			filter,
			order,
		}
	);

	return extractItems(response.minerColdkeys, pagination, transform);
}

export async function getMinerIPs(
	filter?: object,
	order: MinerIPOrder = "ID_ASC",
	after?: string
): Promise<MinerIPPaginatedResponse> {
	const response = await fetchSubnets<{
		minerIps: ResponseItems<MinerIP>;
	}>(
		`query($filter: MinerIpFilter, $order: [MinerIpsOrderBy!]!, $after: Cursor) {
			minerIps(filter: $filter, orderBy: $order, after: $after) {
				nodes {
					id
					ipAddress
					minersCount
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}`,
		{
			after,
			filter,
			order,
		}
	);

	return {
		hasNextPage: response.minerIps?.pageInfo.hasNextPage,
		endCursor: response.minerIps?.pageInfo.endCursor,
		data: response.minerIps?.nodes,
	};
}

export async function getPaginatedMinerIPs(
	filter: object,
	order: MinerIPOrder = "ID_DESC",
	pagination: PaginationOptions
) {
	const response = await fetchSubnets<{
		minerIps: ResponseItems<MinerIP>;
	}>(
		`query($filter: MinerIpFilter, $order: [MinerIpsOrderBy!]!, $after: Cursor, $first: Int!) {
			minerIps(filter: $filter, orderBy: $order, after: $after, first: $first) {
				nodes {
					id
					ipAddress
					minersCount
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				${pagination.after === undefined ? "totalCount" : ""}
			}
		}`,
		{
			after: pagination.after,
			first: pagination.limit,
			filter,
			order,
		}
	);

	return extractItems(response.minerIps, pagination, transform);
}

export async function getMinerIncentive(
	filter?: object,
	order: MinerIncentiveOrder = "ID_ASC",
	after?: string
): Promise<MinerIncentivePaginatedResponse> {
	const response = await fetchSubnets<{
		neuronInfos: ResponseItems<MinerIncentive>;
	}>(
		`query($filter: NeuronInfoFilter, $order: [NeuronInfosOrderBy!]!, $after: Cursor) {
			neuronInfos(filter: $filter, orderBy: $order, after: $after) {
				nodes {
					id
					incentive
					isImmunityPeriod
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}`,
		{
			after,
			filter,
			order,
		}
	);

	return {
		hasNextPage: response.neuronInfos?.pageInfo.hasNextPage,
		endCursor: response.neuronInfos?.pageInfo.endCursor,
		data: response.neuronInfos?.nodes,
	};
}

export async function getColdkeySubnets(coldkey: string, after?: string): Promise<ColdkeySubnetPaginatedResponse> {
	const response = await fetchSubnets<{
		neuronInfos: ResponseItems<{netUid: number}>;
	}>(
		`query($after: Cursor) {
			neuronInfos(filter: {coldkey: {equalTo: "${coldkey}"}}, after: $after, orderBy: NET_UID_ASC, distinct: NET_UID) {
				nodes {
					netUid
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}`,
		{
			after
		}
	);

	return {
		hasNextPage: response.neuronInfos?.pageInfo.hasNextPage,
		endCursor: response.neuronInfos?.pageInfo.endCursor,
		data: response.neuronInfos?.nodes.map(({netUid}) => netUid),
	};
}

export async function getColdkeyInfo(
	coldkey: string,
	after?: string
): Promise<ColdkeyInfoPaginatedResponse> {
	const response = await fetchSubnets<{
		neuronInfos: ResponseItems<ColdkeyInfo>;
	}>(
		`query($after: Cursor) {
			neuronInfos(after: $after, filter: {coldkey: {equalTo: "${coldkey}"}}) {
				nodes {
					hotkey
					stake
					dailyReward
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}`,
		{
			after,
		}
	);
	return {
		hasNextPage: response.neuronInfos?.pageInfo.hasNextPage,
		endCursor: response.neuronInfos?.pageInfo.endCursor,
		data: response.neuronInfos?.nodes,
	};
}

function addSubnetName<T extends { netUid: number; name?: string }>(
	subnet: T,
	subnetNames: Record<string, Record<string, string>>
): T {
	const name = subnetNames[subnet.netUid]?.name || "Unknown";
	return { ...subnet, name } as T;
}

function transform<T = any>(value: T): T {
	return value;
}
