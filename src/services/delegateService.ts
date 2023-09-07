import { DelegateBalance, DelegateInfo, ValidatorBalance } from "./../model/delegate";
import { Delegate } from "../model/delegate";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { extractItems } from "../utils/extractItems";
import { fetchIndexer } from "./fetchService";

import verifiedDelegates from "../delegates.json";

export type DelegateFilter = object;
export type DelegatesOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "AMOUNT_ASC"
	| "AMOUNT_DESC"
	| "BLOCK_NUMBER_ASC"
	| "BLOCK_NUMBER_DESC";

export type DelegateBalanceFilter = object;
export type DelegateBalancesOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "AMOUNT_ASC"
	| "AMOUNT_DESC"
	| "UPDATED_AT_ASC"
	| "UPDATED_AT_DESC";

export async function getDelegates(
	filter: DelegateFilter | undefined,
	order: DelegatesOrder = "BLOCK_NUMBER_DESC",
	pagination: PaginationOptions,
) {
	return fetchDelegates(filter, order, pagination);
}

export async function getDelegateBalances(
	filter: DelegateBalanceFilter | undefined,
	order: DelegateBalancesOrder = "UPDATED_AT_DESC",
	pagination: PaginationOptions,
) {
	return fetchDelegateBalances(filter, order, pagination);
}

export async function getValidatorBalances(
	filter: DelegateBalanceFilter | undefined,
) {
	return fetchValidatorBalances(filter);
}

/*** PRIVATE ***/

async function fetchDelegates(
	filter: DelegateFilter | undefined,
	order: DelegatesOrder = "BLOCK_NUMBER_DESC",
	pagination: PaginationOptions,
) {
	const offset = pagination.offset;

	const response = await fetchIndexer<{ delegates: ResponseItems<Delegate> }>(
		`query ($first: Int!, $offset: Int!, $filter: DelegateFilter, $order: [DelegatesOrderBy!]!) {
			delegates(first: $first, offset: $offset, filter: $filter, orderBy: $order) {
				nodes {
					id
                    account
                    delegate
                    action
                    amount
                    blockNumber
                    extrinsicId
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
			offset,
			filter,
			order,
		}
	);
	const items = extractItems(response.delegates, pagination, addDelegateName);

	return items;
}

async function fetchDelegateBalances(
	filter: DelegateBalanceFilter | undefined,
	order: DelegateBalancesOrder = "UPDATED_AT_DESC",
	pagination: PaginationOptions,
) {
	const offset = pagination.offset;

	const response = await fetchIndexer<{ delegateBalances: ResponseItems<DelegateBalance> }>(
		`query ($first: Int!, $offset: Int!, $filter: DelegateBalanceFilter, $order: [DelegateBalancesOrderBy!]!) {
			delegateBalances(first: $first, offset: $offset, filter: $filter, orderBy: $order) {
				nodes {
					id
                    account
                    delegate
                    amount
					updatedAt
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
			offset,
			filter,
			order,
		}
	);
	const items = extractItems(response.delegateBalances, pagination, addDelegateName);

	return items;
}

async function fetchValidatorBalances(
	filter: DelegateBalanceFilter | undefined,
) {
	const response = await fetchIndexer<{ delegateBalances: ValidatorBalance }>(
		`query ($filter: DelegateBalanceFilter) {
			delegateBalances(filter: $filter) {
				aggregates {
					sum {
						amount
					}
				}
			}
		}`,
		{
			filter,
		}
	);

	const data = response.delegateBalances?.aggregates?.sum?.amount ?? 0;
	return data;
}

function addDelegateName<T extends { delegate: string; delegateName?: string; }>(item: T): T {
	const info = (verifiedDelegates as Record<string, DelegateInfo>)[item.delegate];
	if (info === undefined) return item;
	return { ...item, delegateName: info.name } as T;
}