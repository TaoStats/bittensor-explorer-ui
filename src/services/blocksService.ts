import { Block } from "../model/block";
import { ExplorerSquidBlock } from "../model/explorer-squid/explorerSquidBlock";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { addRuntimeSpec, addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { extractItems } from "../utils/extractItems";
import { fetchDictionary } from "./fetchService";

export type BlocksFilter =
	{ id_eq: string; }
	| { hash_eq: string; }
	| { height_eq: number; };

export type BlocksOrder = string | string[];

export async function getBlock(filter: BlocksFilter) {
	return getArchiveBlock(filter);
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
			filter: filter,
			order,
		}
	);

	const data = extractItems(response.blocks, pagination, transformBlock);
	const blocks = await addRuntimeSpecs(data, it => it.specVersion);

	return blocks;
}

const transformBlock = (block: Block): Block => {
	return block;
};