import { AccountResponse, Balance } from "../model/balance";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { extractItems } from "../utils/extractItems";
import { fetchIndexer } from "./fetchService";

export type BalancesFilter = object;
export type BalancesOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "BALANCE_FREE_ASC"
	| "BALANCE_FREE_DESC"

export async function getBalances(
	filter: BalancesFilter | undefined,
	order: BalancesOrder = "ID_ASC",
	pagination: PaginationOptions
) {
	const response = await fetchIndexer<{
		accounts: ResponseItems<AccountResponse>;
	}>(
		`query ($first: Int!, $after: Cursor, $filter: AccountFilter, $order: [AccountsOrderBy!]!) {
				accounts(first: $first, after: $after, filter: $filter, orderBy: $order) {
					nodes {
						address
						balanceFree
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
	
	return extractItems(response.accounts, pagination, transformItem);
}

const transformItem = (item: AccountResponse): Balance => {
	return {
		id: item.address,
		address: item.address,
		free: item.balanceFree,
		staked: item.balanceStaked,
		total: item.balanceTotal,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
	} as Balance;
};

export async function getBalance(filter: BalancesFilter) {
	const response = await fetchIndexer<{
		accounts: ResponseItems<AccountResponse>;
	}>(
		`query ($filter: AccountFilter) {
			accounts(first: 1, offset: 0, filter: $filter, orderBy: ID_DESC) {
				nodes {
                    address
                    balanceFree
				}
			}
		}`,
		{
			filter,
		}
	);

	const data =
		response.accounts?.nodes[0] && transformItem(response.accounts.nodes[0]);
	return data;
}

export async function countBalanceItems(filter: BalancesFilter) {
	const response = await fetchIndexer<{ accounts: ResponseItems<{ totalCount: number; }> }>(
		`query ($filter: AccountFilter) {
			accounts(filter: $filter) {
				totalCount
			}
		}`,
		{
			filter,
		}
	);
	return response.accounts.totalCount;
}
