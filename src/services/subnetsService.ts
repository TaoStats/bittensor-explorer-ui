import { Subnet } from "../model/subnet";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { extractItems } from "../utils/extractItems";

import { fetchSubnets } from "./fetchService";

export type SubnetsFilter = object;

export type SubnetsOrder =
	| "NET_UID_ASC"
	| "NET_UID_DESC"
	| "CREATED_AT_ASC"
	| "CREATED_AT_DESC";

export async function getSubnets(
	filter: SubnetsFilter | undefined,
	order: SubnetsOrder = "NET_UID_ASC",
	pagination: PaginationOptions,
) {
	const response = await fetchSubnets<{ subnets: ResponseItems<Subnet> }>(
		`query ($first: Int!, $after: Cursor, $filter: SubnetFilter, $order: [SubnetsOrderBy!]!) {
			subnets(first: $first, after: $after, filter: $filter, orderBy: $order) {
				nodes {
					netUid
					createdAt
					owner
					extrinsicId
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

	return extractItems(response.subnets, pagination, transformBlock);
}

const transformBlock = (subnet: Subnet): Subnet => {
	return subnet;
};
