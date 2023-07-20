import { ItemsConnection } from "../model/itemsConnection";
import { MainSquidTransfer } from "../model/main-squid/mainSquidTransfer";
import { PaginationOptions } from "../model/paginationOptions";
import { Transfer } from "../model/transfer";

import { addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { extractConnectionItems } from "../utils/extractConnectionItems";
import { rawAmountToDecimal } from "../utils/number";

import { fetchIndexer } from "./fetchService";

export type TransfersFilter =
	{ accountAddress_eq: string };

export type TransfersOrder = string | string[];

export async function getTransfers(
	filter: TransfersFilter | undefined,
	order: TransfersOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	return fetchTransfers(filter, order, pagination);
}

/*** PRIVATE ***/

async function fetchTransfers(
	filter: TransfersFilter | undefined,
	order: TransfersOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	// FIXME:
	const response = await fetchIndexer<{ transfersConnection: ItemsConnection<MainSquidTransfer> }>(
		`query ($first: Int!, $after: String, $filter: TransferWhereInput, $order: [TransferOrderByInput!]!) {
			transfersConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				edges {
					node {
						id
						transfer {
							id
							amount
							blockNumber
							success
							timestamp
							extrinsicHash
							to {
								publicKey
							}
							from {
								publicKey
							}
						}
						account {
							publicKey
						}
						direction
					}
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
			after,
			// FIXME:
			// filter: transfersFilterToMainSquidFilter(filter),
			order,
		}
	);

	const items = extractConnectionItems(response.transfersConnection, pagination, unifyMainSquidTransfer);
	// const itemsWithRuntimeSpec = await addRuntimeSpecs(items, () => "latest");
	// FIXME:
	// const transfers = await addExtrinsicsInfo(itemsWithRuntimeSpec);

	return items;
}

function unifyMainSquidTransfer(transfer: MainSquidTransfer): Omit<Transfer, "runtimeSpec" | "extrinsic"> {

	return {
		...transfer,
		accountPublicKey: transfer.account.publicKey,
		blockNumber: transfer.transfer.blockNumber,
		timestamp: transfer.transfer.timestamp,
		extrinsicHash: transfer.transfer.extrinsicHash,
		amount: rawAmountToDecimal(transfer.transfer.amount),
		success: transfer.transfer.success,
		fromPublicKey: transfer.transfer.from.publicKey,
		toPublicKey: transfer.transfer.to.publicKey,
	};
}