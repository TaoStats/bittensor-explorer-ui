import { Extrinsic } from "../model/extrinsic";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { addRuntimeSpec, addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { extractItems } from "../utils/extractItems";

import { fetchDictionary } from "./fetchService";
import { getBlock } from "./blocksService";

export type ExtrinsicsFilter = object;

export type ExtrinsicsOrder = string | string[];

export async function getExtrinsic(filter: ExtrinsicsFilter) {
	const response = await fetchDictionary<{ extrinsics: ResponseItems<Extrinsic> }>(
		`query ($filter: ExtrinsicFilter) {
			extrinsics(first: 1, offset: 0, filter: $filter, orderBy: ID_DESC) {
				nodes {
					id
					txHash
					call
					signer
					success
					tip
					version
					blockHeight
					args
				}
			}
		}`,
		{
			filter: filter,
		}
	);

	const data = response.extrinsics.nodes[0] && transformExtrinsic(response.extrinsics.nodes[0]);
	if (!data) return;

	const blockResponse = await getBlock({ height: { equalTo: data.blockHeight } });
	if (!blockResponse) return;
	const newData = { ...data, specVersion: blockResponse.specVersion, timestamp: blockResponse.timestamp };

	const extrinsic = addRuntimeSpec(newData, it => it.specVersion);

	return extrinsic;
}

export async function getExtrinsicsByName(
	name: string,
	order: ExtrinsicsOrder = "ID_DESC",
	pagination: PaginationOptions,
) {
	const filter: ExtrinsicsFilter = { call: { equalTo: name } };

	return getExtrinsics(filter, order, false, pagination);
}

export async function getExtrinsics(
	filter: ExtrinsicsFilter | undefined,
	order: ExtrinsicsOrder = "ID_DESC",
	fetchTotalCount: boolean,
	pagination: PaginationOptions,
) {
	const offset = pagination.offset;

	const response = await fetchDictionary<{ extrinsics: ResponseItems<Extrinsic> }>(
		`query ($first: Int!, $offset: Int!, $filter: ExtrinsicFilter, $order: [ExtrinsicsOrderBy!]!) {
			extrinsics(first: $first, offset: $offset, filter: $filter, orderBy: $order) {
				nodes {
					id
					txHash
					call
					signer
					success
					tip
					version
					blockHeight
					args
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				${fetchTotalCount ? "totalCount" : ""}
			}
		}`,
		{
			first: pagination.limit,
			offset,
			filter: filter,
			order,
		}
	);

	const items = extractItems(response.extrinsics, pagination, transformExtrinsic);

	const promises = items.data.map(async (item) => {
		const response = await getBlock({ height: { equalTo: item.blockHeight } });
		if (!response) return;
		
		return { ...item, specVersion: response.specVersion, timestamp: response.timestamp };
	});
	const data = await Promise.all(promises);
	const newItems = {...items, data: data};

	const extrinsics = await addRuntimeSpecs(newItems, it => it?.specVersion ?? "latest");

	return extrinsics;
}

/*** PRIVATE ***/

const transformExtrinsic = (extrinsic: Extrinsic): Extrinsic => {
	return extrinsic;
};
