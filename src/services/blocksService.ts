import { Block } from "../model/block";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { extractItems } from "../utils/extractItems";

import { fetchDictionary } from "./fetchService";

export type BlocksFilter = object;

export type BlocksOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "HEIGHT_ASC"
	| "HEIGHT_DESC"
	| "EVENT_NUMBER_ASC"
	| "EVENT_NUMBER_DESC"
	| "EXTRINSIC_NUMBER_ASC"
	| "EXTRINSIC_NUMBER_DESC";

export async function getBlock(filter: BlocksFilter) {
	const response = await fetchDictionary<{ blocks: ResponseItems<Block> }>(
		`query ($filter: BlockFilter) {
			blocks(first: 1, offset: 0, filter: $filter, orderBy: ID_DESC) {
				nodes {
					id
					hash
					height
					timestamp
					parentHash
					specVersion
				}
			}
		}`,
		{
			filter,
		}
	);

	const data = response.blocks?.nodes[0] && transformBlock(response.blocks.nodes[0]);
	return data;
}

export async function getBlocks(
	filter: BlocksFilter | undefined,
	order: BlocksOrder = "ID_DESC",
	pagination: PaginationOptions,
) {
	const offset = pagination.offset;

	const response = await fetchDictionary<{ blocks: ResponseItems<Block> }>(
		`query ($first: Int!, $offset: Int!, $filter: BlockFilter, $order: [BlocksOrderBy!]!) {
			blocks(first: $first, offset: $offset, filter: $filter, orderBy: $order) {
				nodes {
					id
					hash
					height
					timestamp
					parentHash
					specVersion
					eventCount
					extrinsicCount
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				${filter !== undefined ? "totalCount" : ""}
			}
		}`,
		{
			first: pagination.limit,
			offset,
			filter,
			order,
		}
	);

	return extractItems(response.blocks, pagination, transformBlock);
}

const transformBlock = (block: Block): Block => {
	return block;
};
