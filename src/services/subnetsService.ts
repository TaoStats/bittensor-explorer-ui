import { Subnet } from "../model/subnet";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import subnetNames from "../subnets_names.json";
import { extractItems } from "../utils/extractItems";
import { fetchIndexer } from "./fetchService";

export type SubnetsFilter = object;

export type SubnetsOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "NET_UID_ASC"
	| "NET_UID_DESC"
	| "CREATED_AT_ASC"
	| "CREATED_AT_DESC";

export async function getSubnets(
	order: SubnetsOrder = "NET_UID_ASC",
	pagination: PaginationOptions,
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

	return extractItems(
		response.subnets,
		pagination,
		addSubnetName,
		subnetNames
	);
}

function addSubnetName<T extends { netUid: number; name?: string }>(
	subnet: T,
	subnetNames: Record<string, string>
): T {
	const name = subnetNames[subnet.netUid] || "Unknown";
	return { ...subnet, name } as T;
}
