import { Extrinsic } from "../model/extrinsic";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { extractItems } from "../utils/extractItems";
import { fetchDictionary } from "./fetchService";

export type ExtrinsicsFilter = object;

export type ExtrinsicsOrder = string | string[];

export async function getExtrinsic(filter: ExtrinsicsFilter) {
	const response = await fetchDictionary<{ extrinsics: ResponseItems<Extrinsic> }>(
		`query ($filter: ExtrinsicFilter) {
			extrinsics(first: 1, offset: 0, filter: $filter, orderBy: ID_DESC) {
				nodes {
					id
					txHash
					module
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
	return data;
}

export async function getExtrinsicsByName(
	name: string,
	order: ExtrinsicsOrder = "ID_DESC",
	pagination: PaginationOptions,
) {
	const [module, call] = name.split(".");
	const filter: ExtrinsicsFilter = { and: [{module: {equalTo: module}}, { call: { equalTo: call } }] };

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
					module
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
			filter,
			order,
		}
	);

	return extractItems(response.extrinsics, pagination, transformExtrinsic);
}

/*** PRIVATE ***/

const transformExtrinsic = (extrinsic: Extrinsic): Extrinsic => {
	return extrinsic;
};
