import { Block } from "../model/block";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { addRuntimeSpec, addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { extractItems } from "../utils/extractItems";
import { fetchDictionary } from "./fetchService";

export type BlocksFilter =
	{ id: object; }
	| { hash: object; }
	| { height: object; };

export type BlocksOrder = string | string[];

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
			filter: filter,
		}
	);

	const data = response.blocks.nodes[0] && transformBlock(response.blocks.nodes[0]);
	const block = await addRuntimeSpec(data, it => it.specVersion);

	return block;
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
			filter,
			order,
		}
	);

	const data = extractItems(response.blocks, pagination, transformBlock);
	const blocks = await addRuntimeSpecs(data, it => it.specVersion);

	console.log("okay after adding runtime specs");

	return blocks;
}

const transformBlock = (block: Block): Block => {
	return block;
};