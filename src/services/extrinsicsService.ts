import { Extrinsic } from "../model/extrinsic";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { addRuntimeSpec, addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { decodeAddress } from "../utils/formatAddress";
import { lowerFirst, upperFirst } from "../utils/string";
import { extractItems } from "../utils/extractItems";

import { getRuntimeSpec } from "./runtimeService";
import { fetchDictionary } from "./fetchService";
import { getBlock } from "./blocksService";

export type ExtrinsicsFilter =
	{ id_eq: string; }
	| { hash_eq: string; }
	| { blockId_eq: string; }
	| { palletName_eq: string; }
	| { palletName_eq: string, callName_eq: string; }
	| { signerAddress_eq: string; };

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
			filter: extrinsicFilterToArchiveFilter(filter),
		}
	);

	const data = response.extrinsics.nodes[0] && unifyArchiveExtrinsic(response.extrinsics.nodes[0]);

	const blockResponse = await getBlock({ height: { equalTo: data.blockHeight } });
	const newData = { ...data, specVersion: blockResponse.specVersion, timestamp: blockResponse.timestamp };

	const extrinsic = addRuntimeSpec(newData, it => it.specVersion);

	return extrinsic;
}

export async function getExtrinsicsByName(
	name: string,
	order: ExtrinsicsOrder = "ID_DESC",
	pagination: PaginationOptions,
) {
	let [palletName = "", callName = ""] = name.split(".");

	const latestRuntimeSpec = await getRuntimeSpec("latest");

	// try to fix casing according to latest runtime spec
	const runtimePallet = latestRuntimeSpec.metadata.pallets.find(it => it.name.toLowerCase() === palletName.toLowerCase());
	const runtimeCall = runtimePallet?.calls.find(it => it.name.toLowerCase() === callName.toLowerCase());

	// use found names from runtime metadata or try to fix the first letter casing as fallback
	palletName = runtimePallet?.name.toString() || upperFirst(palletName);
	callName = runtimeCall?.name.toString() || lowerFirst(callName);

	const filter: ExtrinsicsFilter = callName
		? { palletName_eq: palletName, callName_eq: callName }
		: { palletName_eq: palletName };

	// const counterFilter = callName
	// 	? `Extrinsics.${palletName}.${callName}`
	// 	: `Extrinsics.${palletName}`;

	// // use item counter to fetch total count quickly
	// const countResponse = await fetchExplorerSquid<{ itemsCounterById: ItemsCounter | null }>(
	// 	network,
	// 	`query ($counterFilter: String!) {
	// 		itemsCounterById(id: $counterFilter) {
	// 			total
	// 		}
	// 	}`,
	// 	{
	// 		counterFilter,
	// 	}
	// );

	// const extrinsics = await getExplorerSquidExtrinsics(filter, order, pagination, false);
	// extrinsics.pagination.totalCount = countResponse.itemsCounterById?.total;

	// return extrinsics;

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
			filter: extrinsicFilterToArchiveFilter(filter),
			order,
		}
	);

	const items = extractItems(response.extrinsics, pagination, unifyArchiveExtrinsic);

	const promises = items.data.map(async (item) => {
		const response = await getBlock({ height: { equalTo: item.blockHeight } });
		return { ...item, specVersion: response.specVersion, timestamp: response.timestamp };
	});
	const data = await Promise.all(promises);
	const newItems = {...items, data: data};

	const extrinsics = await addRuntimeSpecs(newItems, it => it.specVersion);

	return extrinsics;
}

/*** PRIVATE ***/

function unifyArchiveExtrinsic(extrinsic: Extrinsic): Omit<Extrinsic, "runtimeSpec"> {
	const [palletName, callName] = extrinsic.call.split(".") as [string, string];

	return {
		...extrinsic,
		callName,
		palletName,
		signature: null,
		fee: extrinsic.fee ? BigInt(extrinsic.fee) : null,
		tip: null,
	};
}

function extrinsicFilterToArchiveFilter(filter?: ExtrinsicsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("id_eq" in filter) {
		return {
			id: {
				equalTo: filter.id_eq
			}
		};
	} else if ("blockId_eq" in filter) {
		return {
			block: {
				id_eq: filter.blockId_eq
			}
		};
	} else if ("signerAddress_eq" in filter) {
		const publicKey = decodeAddress(filter.signerAddress_eq);

		return {
			OR: [
				{ signature_jsonContains: `{"address": "${publicKey}" }` },
				{ signature_jsonContains: `{"address": { "value": "${publicKey}"} }` },
			],
		};
	} else if ("palletName_eq" in filter) {
		return {
			call: {
				name_eq: ("callName_eq" in filter)
					? `${filter.palletName_eq}.${filter.callName_eq}`
					: filter.palletName_eq
			}
		};
	}

	return filter;
}
