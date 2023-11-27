import {
	DelegateBalance,
	DelegateInfo,
	ValidatorBalance,
} from "./../model/delegate";
import { Delegate } from "../model/delegate";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { extractItems } from "../utils/extractItems";
import { fetchIndexer } from "./fetchService";

export type DelegateFilter = {
	[key: string]: any;
};
export type DelegatesOrder =
  | "ID_ASC"
  | "ID_DESC"
  | "AMOUNT_ASC"
  | "AMOUNT_DESC"
  | "BLOCK_NUMBER_ASC"
  | "BLOCK_NUMBER_DESC";

export type ValidatorFilter = object;
export type DelegateBalanceFilter = object;
export type DelegateBalancesOrder =
  | "ID_ASC"
  | "ID_DESC"
  | "AMOUNT_ASC"
  | "AMOUNT_DESC"
  | "DELEGATE_FROM_ASC"
  | "DELEGATE_FROM_DESC"
  | "UPDATED_AT_ASC"
  | "UPDATED_AT_DESC";

export async function getDelegates(
	filter: DelegateFilter | undefined,
	order: DelegatesOrder = "BLOCK_NUMBER_DESC",
	pagination: PaginationOptions
) {
	return fetchDelegates(filter, order, pagination);
}

export async function getDelegateBalances(
	filter: DelegateBalanceFilter | undefined,
	order: DelegateBalancesOrder = "UPDATED_AT_DESC",
	pagination: PaginationOptions
) {
	return fetchDelegateBalances(filter, order, pagination);
}

export async function getValidatorBalances(
	filter: DelegateBalanceFilter | undefined
) {
	return fetchValidatorBalances(filter);
}

export async function fetchVerifiedDelegates() {
	const res = await fetch(
		"https://raw.githubusercontent.com/opentensor/bittensor-delegates/main/public/delegates.json",
		{
			method: "GET",
		}
	);

	if (res.status !== 200) return {};

	let delegates: Record<string, DelegateInfo> = {};
	if (res.status === 200) delegates = await res.json();

	return delegates;
}

/*** PRIVATE ***/

async function fetchDelegates(
	filter: DelegateFilter | undefined,
	order: DelegatesOrder = "BLOCK_NUMBER_DESC",
	pagination: PaginationOptions
) {
	const response = await fetchIndexer<{ delegates: ResponseItems<Delegate> }>(
		`query ($first: Int!, $after: Cursor, $filter: DelegateFilter, $order: [DelegatesOrderBy!]!) {
			delegates(first: $first, after: $after, filter: $filter, orderBy: $order) {
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
	const verifiedDelegates = await fetchVerifiedDelegates();
	const items = extractItems(
		response.delegates,
		pagination,
		addDelegateName,
		verifiedDelegates
	);

	return items;
}

async function fetchDelegateBalances(
	filter: DelegateBalanceFilter | undefined,
	order: DelegateBalancesOrder = "UPDATED_AT_DESC",
	pagination: PaginationOptions
) {
	const response = await fetchIndexer<{
		delegateBalances: ResponseItems<DelegateBalance>;
	}>(
		`query ($first: Int!, $after: Cursor, $filter: DelegateBalanceFilter, $order: [DelegateBalancesOrderBy!]!) {
			delegateBalances(first: $first, after: $after, filter: $filter, orderBy: $order) {
				nodes {
					id
                    account
                    delegate
                    amount
					updatedAt
					delegateFrom
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
	const verifiedDelegates = await fetchVerifiedDelegates();
	const items = extractItems(
		response.delegateBalances,
		pagination,
		addDelegateName,
		verifiedDelegates
	);

	return items;
}

export async function countNominators(filter: DelegateBalanceFilter) {
	const response = await fetchIndexer<{
		delegateBalances: ResponseItems<DelegateBalance>;
	}>(
		`query ($filter: DelegateBalanceFilter) {
			delegateBalances(filter: $filter) {
				totalCount
			}
		}`,
		{
			filter,
		}
	);

	return response.delegateBalances.totalCount;
}

async function fetchValidatorBalances(
	filter: ValidatorFilter | undefined
) {
	const response = await fetchIndexer<{ validators: ValidatorBalance }>(
		`query ($filter: ValidatorFilter) {
			validators(filter: $filter) {
				nodes {
					amount
				}
			}
		}`,
		{
			filter,
		}
	);

	const data = response.validators?.nodes[0]?.amount ?? 0;
	return data;
}

function addDelegateName<T extends { delegate: string; delegateName?: string }>(
	item: T,
	verifiedDelegates: Record<string, DelegateInfo>
): T {
	const info = (verifiedDelegates as Record<string, DelegateInfo>)[
		item.delegate
	];
	if (info === undefined) return item;
	return { ...item, delegateName: info.name } as T;
}
