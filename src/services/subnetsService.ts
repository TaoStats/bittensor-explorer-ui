import {
	Subnet,
	SubnetEmissionsHistory,
	SubnetEmissionsHistoryPaginatedResponse,
} from "../model/subnet";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import subnetNames from "../subnets_names.json";
import { extractItems } from "../utils/extractItems";
import { fetchHistorical, fetchIndexer } from "./fetchService";

export type SubnetsFilter = object;

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
	| "CREATED_AT_ASC"
	| "CREATED_AT_DESC";

export type SubnetEmissionsHistoryOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "HEIGHT_ASC"
	| "HEIGHT_DESC";

export async function getSubnets(
	filter: SubnetsFilter | undefined,
	order: SubnetsOrder = "NET_UID_ASC",
	pagination: PaginationOptions
) {
	const response = await fetchIndexer<{ subnets: ResponseItems<Subnet> }>(
		`query ($order: [SubnetsOrderBy!]!) {
			subnets(orderBy: $order) {
				nodes {
					id
					netUid
					createdAt
					owner
					extrinsicId
					emission
					raoRecycled
					raoRecycled24H
					timestamp
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
			order,
		}
	);

	return extractItems(response.subnets, pagination, addSubnetName, subnetNames);
}

export async function getSubnetEmissionsHistory(
	filter?: object,
	order: SubnetEmissionsHistoryOrder = "ID_ASC",
	distinct?: string,
	after?: string,
	limit = 100
): Promise<SubnetEmissionsHistoryPaginatedResponse> {
	const response = await fetchHistorical<{
		subnets: ResponseItems<SubnetEmissionsHistory>;
	}>(
		`query($filter: SubnetFilter, $order: [SubnetsOrderBy!]!, $distinct: [subnets_distinct_enum], $after: Cursor, $first: Int!) {
			subnets(filter: $filter, orderBy: $order, distinct: $distinct, after: $after, first: $first) {
				nodes {
					emission
					height
					id
					nodeId
					subnetId
					timestamp
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			  }
		}`,
		{
			first: limit,
			after,
			filter,
			order,
			distinct,
		}
	);

	return {
		hasNextPage: response.subnets?.pageInfo.hasNextPage,
		endCursor: response.subnets?.pageInfo.endCursor,
		data: response.subnets?.nodes,
	};
}

function addSubnetName<T extends { netUid: number; name?: string }>(
	subnet: T,
	subnetNames: Record<string, string>
): T {
	const name = subnetNames[subnet.netUid] || "Unknown";
	return { ...subnet, name } as T;
}
