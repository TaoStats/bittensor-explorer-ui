import { ArchiveExtrinsic } from "../model/archive/archiveExtrinsic";
import { ExplorerSquidExtrinsic } from "../model/explorer-squid/explorerSquidExtrinsic";
import { ItemsConnection } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { addRuntimeSpec, addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { decodeAddress } from "../utils/formatAddress";
import { lowerFirst, upperFirst } from "../utils/string";
import { extractConnectionItems } from "../utils/extractConnectionItems";

import { getRuntimeSpec } from "./runtimeService";
import { Extrinsic } from "../model/extrinsic";
import { fetchDictionary } from "./fetchService";

export type ExtrinsicsFilter =
	{ id_eq: string; }
	| { hash_eq: string; }
	| { blockId_eq: string; }
	| { palletName_eq: string; }
	| { palletName_eq: string, callName_eq: string; }
	| { signerAddress_eq: string; };

export type ExtrinsicsOrder = string | string[];

export async function getExtrinsic(filter: ExtrinsicsFilter) {
	return getArchiveExtrinsic(filter);
}

export async function getExtrinsicsByName(
	name: string,
	order: ExtrinsicsOrder = "id_DESC",
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

	return getExtrinsics(filter, order, pagination, false);
}

/*** PRIVATE ***/

async function getArchiveExtrinsic(filter?: ExtrinsicsFilter) {
	// FIXME:
	const response = await fetchDictionary<{ extrinsics: ArchiveExtrinsic[] }>(
		`query ($filter: ExtrinsicWhereInput) {
			extrinsics(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
				id
				hash
				call {
					name
					args
				}
				block {
					id
					hash
					height
					timestamp
					spec {
						specVersion
					}
				}
				signature
				indexInBlock
				success
				tip
				fee
				error
				version
			}
		}`,
		{
			filter: extrinsicFilterToArchiveFilter(filter),
		}
	);

	const data = response.extrinsics[0] && unifyArchiveExtrinsic(response.extrinsics[0]);
	const extrinsic = addRuntimeSpec(data, it => it.specVersion);

	return extrinsic;
}

export async function getExtrinsics(
	filter: ExtrinsicsFilter | undefined,
	order: ExtrinsicsOrder = "id_DESC",
	pagination: PaginationOptions,
	fetchTotalCount = true
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();
	// FIXME:
	const response = await fetchDictionary<{ extrinsicsConnection: ItemsConnection<ArchiveExtrinsic> }>(
		`query ($first: Int!, $after: String, $filter: ExtrinsicWhereInput, $order: [ExtrinsicOrderByInput!]!) {
			extrinsicsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				edges {
					node {
						id
						hash
						call {
							name
							args
						}
						block {
							id
							hash
							height
							timestamp
							spec {
								specVersion
							}
						}
						signature
						indexInBlock
						success
						tip
						fee
						error
						version
					}
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
			after,
			filter: extrinsicFilterToArchiveFilter(filter),
			order,
		}
	);

	const items = extractConnectionItems(response.extrinsicsConnection, pagination, unifyArchiveExtrinsic);
	const extrinsics = await addRuntimeSpecs(items, it => it.specVersion);

	return extrinsics;
}

async function getExplorerSquidExtrinsics(
	filter: ExtrinsicsFilter | undefined,
	order: ExtrinsicsOrder = "id_DESC",
	pagination: PaginationOptions,
	fetchTotalCount = true
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	// FIXME:
	const response = await fetchDictionary<{ extrinsicsConnection: ItemsConnection<ExplorerSquidExtrinsic> }>(
		`query ($first: Int!, $after: String, $filter: ExtrinsicWhereInput, $order: [ExtrinsicOrderByInput!]!) {
			extrinsicsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				edges {
					node {
						id
						extrinsicHash
						block {
							id
							hash
							height
							timestamp
							specVersion
						}
						mainCall {
							callName
							palletName
						}
						indexInBlock
						success
						tip
						fee
						signerPublicKey
						error
						version
					}
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
			after,
			filter: extrinsicFilterToExplorerSquidFilter(filter),
			order,
		}
	);

	const items = extractConnectionItems(response.extrinsicsConnection, pagination, unifyExplorerSquidExtrinsic);
	const extrinsics = await addRuntimeSpecs(items, it => it.specVersion);

	return extrinsics;
}

function unifyArchiveExtrinsic(extrinsic: ArchiveExtrinsic): Omit<Extrinsic, "runtimeSpec"> {
	const [palletName, callName] = extrinsic.call.name.split(".") as [string, string];

	return {
		...extrinsic,
		blockId: extrinsic.block.id,
		blockHeight: extrinsic.block.height,
		timestamp: extrinsic.block.timestamp,
		callName,
		palletName,
		args: extrinsic.call.args,
		signer: extrinsic.signature?.address?.value || extrinsic.signature?.address || null,
		signature: extrinsic.signature?.signature?.value || extrinsic.signature?.signature || null,
		fee: extrinsic.fee ? BigInt(extrinsic.fee) : null,
		tip: extrinsic.tip ? BigInt(extrinsic.tip) : null,
		specVersion: extrinsic.block.spec.specVersion
	};
}

function unifyExplorerSquidExtrinsic(extrinsic: ExplorerSquidExtrinsic): Omit<Extrinsic, "runtimeSpec"> {
	return {
		...extrinsic,
		hash: extrinsic.extrinsicHash,
		blockId: extrinsic.block.id,
		blockHeight: extrinsic.block.height,
		timestamp: extrinsic.block.timestamp,
		callName: extrinsic.mainCall.callName,
		palletName: extrinsic.mainCall.palletName,
		args: null,
		signer: extrinsic.signerPublicKey,
		signature: null, // TODO is present in archive but not here
		error: extrinsic.error && JSON.parse(extrinsic.error),
		fee: extrinsic.fee ? BigInt(extrinsic.fee) : null,
		tip: extrinsic.tip ? BigInt(extrinsic.tip) : null,
		specVersion: extrinsic.block.specVersion
	};
}

function extrinsicFilterToArchiveFilter(filter?: ExtrinsicsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("blockId_eq" in filter) {
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

function extrinsicFilterToExplorerSquidFilter(filter?: ExtrinsicsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("hash_eq" in filter) {
		return {
			extrinsicHash_eq: filter.hash_eq
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
			signerPublicKey_eq: publicKey
		};
	} else if ("palletName_eq" in filter) {
		return {
			mainCall: {
				...filter
			}
		};
	}

	return filter;
}
