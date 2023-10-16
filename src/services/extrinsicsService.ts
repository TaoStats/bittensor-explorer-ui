import { Extrinsic, ExtrinsicResponse } from "../model/extrinsic";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { extractItems } from "../utils/extractItems";
import { fetchDictionary } from "./fetchService";

export type ExtrinsicsFilter = object;

export type ExtrinsicsOrder = string | string[];

export async function getExtrinsic(filter: ExtrinsicsFilter) {
	const response = await fetchDictionary<{ extrinsics: ResponseItems<ExtrinsicResponse> }>(
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
	const filter: ExtrinsicsFilter = { and: [{ module: { equalTo: module } }, { call: { equalTo: call } }] };

	return getExtrinsics(filter, order, false, pagination);
}

export async function getExtrinsics(
	filter: ExtrinsicsFilter | undefined,
	order: ExtrinsicsOrder = "ID_DESC",
	fetchTotalCount: boolean,
	pagination: PaginationOptions,
) {
	const response = await fetchDictionary<{ extrinsics: ResponseItems<ExtrinsicResponse> }>(
		`query ($first: Int!, $after: Cursor, $filter: ExtrinsicFilter, $order: [ExtrinsicsOrderBy!]!) {
			extrinsics(first: $first, after: $after, filter: $filter, orderBy: $order) {
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

	return extractItems(response.extrinsics, pagination, transformExtrinsic);
}

/*** PRIVATE ***/

const transformExtrinsic = (extrinsic: ExtrinsicResponse): Extrinsic => {
	const args = JSON.parse(extrinsic.args) as string[];
	return {
		...extrinsic,
		args
	};
};
