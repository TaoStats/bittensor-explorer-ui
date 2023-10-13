import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { Transfer } from "../model/transfer";

import { extractItems } from "../utils/extractItems";
import { fetchIndexer } from "./fetchService";

export type TransfersFilter = {
	[key: string]: any;
};
export type TransfersOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "AMOUNT_ASC"
	| "AMOUNT_DESC"
	| "BLOCK_NUMBER_ASC"
	| "BLOCK_NUMBER_DESC";


export async function getTransfers(
	filter: TransfersFilter | undefined,
	order: TransfersOrder = "BLOCK_NUMBER_DESC",
	pagination: PaginationOptions,
) {
	return fetchTransfers(filter, order, pagination);
}

/*** PRIVATE ***/

async function fetchTransfers(
	filter: TransfersFilter | undefined,
	order: TransfersOrder = "BLOCK_NUMBER_DESC",
	pagination: PaginationOptions,
) {
	const response = await fetchIndexer<{ transfers: ResponseItems<Transfer> }>(
		`query ($first: Int!, $after: Cursor, $filter: TransferFilter, $order: [TransfersOrderBy!]!) {
			transfers(first: $first, after: $after, filter: $filter, orderBy: $order) {
				nodes {
					id
					from
					to
					amount
					extrinsicId
					blockNumber
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
	const items = extractItems(response.transfers, pagination, (x) => x);

	return items;
}