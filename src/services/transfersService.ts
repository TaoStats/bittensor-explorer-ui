import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { Transfer } from "../model/transfer";

import { extractItems } from "../utils/extractItems";
import { fetchIndexer } from "./fetchService";

export type TransfersFilter = object;
export type TransfersOrder = string | string[];

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
	const offset = pagination.offset;

	const response = await fetchIndexer<{ transfers: ResponseItems<Transfer> }>(
		`query ($first: Int!, $offset: Int!, $filter: TransferFilter, $order: [TransfersOrderBy!]!) {
			transfers(first: $first, offset: $offset, filter: $filter, orderBy: $order) {
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
					startCursor
				}
				${(filter != undefined) ? "totalCount" : ""}
			}
		}`,
		{
			first: pagination.limit,
			offset,
			filter,
			order,
		}
	);
	const items = extractItems(response.transfers, pagination, (x) => x);

	return items;
}