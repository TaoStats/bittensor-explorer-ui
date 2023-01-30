import { ArchiveConnection } from "../model/archiveConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { addRuntimeSpec, addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { lowerFirst, upperFirst } from "../utils/string";
import { unifyConnection } from "../utils/unifyConnection";
import { fetchArchive, fetchExplorerSquid } from "./fetchService";
import { getExplorerSquid } from "./networksService";
import { getRuntimeSpec } from "./runtimeService";
import { Extrinsic } from "../model/extrinsic";
import { ItemsCounter } from "../model/itemsCounter";

export type ExtrinsicsFilter = any;
export type ExtrinsicsCallerFilter = any;

export type ExtrinsicsOrder = string | string[];

export async function getExtrinsic(network: string, filter?: ExtrinsicsFilter) {
	const response = await fetchArchive<{extrinsics: Omit<Extrinsic, "runtimeSpec">[]}>(
		network,
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
			filter,
		}
	);
		
	return addRuntimeSpec(
		network,
		response.extrinsics[0],
		it => it.block.spec.specVersion
	);
}

export async function getExtrinsicsByAccount(
	network: string,
	address: string,
	order: ExtrinsicsOrder = "id_DESC",
	pagination: PaginationOptions
) {
	if (getExplorerSquid(network)) {
		const filter = {
			signerPublicKey_eq: address
		};
		return await getExtrinsics(network, filter, order, pagination);
	}
	const filter = {
		OR: [
			{ signature_jsonContains: `{"address": "${address}" }` },
			{ signature_jsonContains: `{"address": { "value": "${address}"} }` },
		],
	};
	return await getExtrinsics(network, filter, order, pagination);
}

export async function getExtrinsicsByName(
	network: string,
	name: string,
	order: ExtrinsicsOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	let [pallet = "", call = ""] = name.split(".");

	// try to fix casing according to latest runtime spec
	const latestRuntimeSpec = await getRuntimeSpec(network, "latest");

	const runtimePallet = latestRuntimeSpec.metadata.pallets.find(it => it.name.toLowerCase() === pallet.toLowerCase());
	const runtimeCall = runtimePallet?.calls.find(it => it.name.toLowerCase() === call.toLowerCase());

	// use found names from runtime metadata or try to fix the first letter casing as fallback
	pallet = runtimePallet?.name.toString() || upperFirst(pallet);
	call = runtimeCall?.name.toString() || lowerFirst(call);

	if(getExplorerSquid(network)) {
		const after = pagination.offset === 0 ? null : pagination.offset.toString();

		const filter = {
			mainCall: {
				palletName_eq: pallet,
				callName_eq: call,
			}
		};

		const counterFilter = `Extrinsics.${pallet}.${call}`;

		const response = await fetchExplorerSquid<{ extrinsicsConnection: ArchiveConnection<any>, itemsCounterById: ItemsCounter}>(
			network,
			`query ($first: Int!, $after: String, $filter: ExtrinsicWhereInput, $counterFilter: String!, $order: [ExtrinsicOrderByInput!]!) {
			extrinsicsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				edges {
					node {
						id
						block {
							id
							hash
							height
							timestamp
							specVersion
						}
						calls {
							callName
							palletName
							argsStr
						}
						indexInBlock
						success
						tip
						fee
						signerPublicKey
						error
						version
						extrinsicHash
					}
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
			}
			itemsCounterById(id: $counterFilter) {
				total
			}
		}`,
			{
				first: pagination.limit,
				after,
				filter,
				counterFilter,
				order,
			}
		);

		// if the items exist, return them
		if (response.itemsCounterById !== null && response.itemsCounterById.total !== null) {

			// unify the response
			const data = {
				...response.extrinsicsConnection,
				totalCount: response.itemsCounterById.total,
				edges: response.extrinsicsConnection.edges.map((item) => {
					const itemData = {
						node: {
							...item.node,
							hash: item.node.extrinsicHash,
							block: {
								...item.node.block,
								spec: {
									specVersion: item.node.block.specVersion,
								}
							},
							call: {
								name: item.node.calls[0].palletName.concat(".", item.node.calls[0].callName),
								args: item.node.calls[0].argsStr,
							},
						}
					};
					return itemData;
				}),
			};

			{
				return addRuntimeSpecs(
					network,
					unifyConnection(
						data,
						pagination.limit,
						pagination.offset
					),
					it => it.block.spec.specVersion
				);
			}
		}

		// empty response
		return addRuntimeSpecs(
			network,
			unifyConnection(
				{
					edges:[],
					pageInfo: {
						endCursor: "",
						hasNextPage: false,
						hasPreviousPage: false,
						startCursor: ""
					},
					totalCount: 0,
				},
				pagination.limit,
				pagination.offset
			),
			it => it.block.spec.specVersion
		);
	}

	const filter = {
		call: {
			name_eq: `${pallet}.${call}`
		}
	};

	return getExtrinsicsWithoutTotalCount(network, filter, order, pagination);
}

export async function getExtrinsics(
	network: string,
	filter: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	if (getExplorerSquid(network)) {

		const response = await fetchExplorerSquid<{ extrinsicsConnection: ArchiveConnection<any> }>(
			network,
			`query ($first: Int!, $after: String, $filter: ExtrinsicWhereInput, $order: [ExtrinsicOrderByInput!]!) {
			extrinsicsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				edges {
					node {
						id
						block {
							id
							hash
							height
							timestamp
							specVersion
						}
						calls {
							callName
							palletName
							argsStr
						}
						indexInBlock
						success
						tip
						fee
						signerPublicKey
						error
						version
						extrinsicHash
					}
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				totalCount
			}
		}`,
			{
				first: pagination.limit,
				after,
				filter,
				order,
			}
		);

		// unify the response
		const data = {
			...response.extrinsicsConnection,
			edges: response.extrinsicsConnection.edges.map((item) => {
				const itemData = {
					node: {
						...item.node,
						hash: item.node.extrinsicHash,
						block: {
							...item.node.block,
							spec: {
								specVersion: item.node.block.specVersion,
							}
						},
						call: {
							name: item.node.calls[0].palletName.concat(".", item.node.calls[0].callName),
							args: item.node.calls[0].argsStr,
						},
					}
				};
				return itemData;
			}),
		};

		return addRuntimeSpecs(
			network,
			unifyConnection(
				data,
				pagination.limit,
				pagination.offset
			),
			it => it.block.spec.specVersion
		);
	}

	const response = await fetchArchive<{ extrinsicsConnection: ArchiveConnection<any> }>(
		network,
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
				totalCount
			}
		}`,
		{
			first: pagination.limit,
			after,
			filter,
			order,
		}
	);

	return addRuntimeSpecs(
		network,
		unifyConnection(
			response.extrinsicsConnection,
			pagination.limit,
			pagination.offset
		),
		it => it.block.spec.specVersion
	);
}


export async function getExtrinsicsWithoutTotalCount(
	network: string,
	filter: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	const response = await fetchArchive<{ extrinsics: Extrinsic[] }>(
		network,
		`query ($limit: Int!, $offset: Int!, $filter: ExtrinsicWhereInput, $order: [ExtrinsicOrderByInput!]) {
			extrinsics(limit: $limit, offset: $offset, where: $filter, orderBy: $order) {
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
			limit: pagination.limit + 1, // get one item more to test if next page exists
			offset: pagination.offset,
			filter,
			order,
		}
	);

	const items: Extrinsic[] = response.extrinsics;
	const hasNextPage = items.length > pagination.limit;

	if (hasNextPage) {
		// remove testing item from next page
		items.pop();
	}

	return addRuntimeSpecs(
		network,
		{
			data: items,
			pagination: {
				...pagination,
				hasNextPage
			}
		},
		it => it.block.spec.specVersion
	);
}