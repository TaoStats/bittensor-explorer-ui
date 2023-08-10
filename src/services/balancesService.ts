import { AccountResponse, Balance } from "../model/balance";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { extractItems } from "../utils/extractItems";
import { fetchIndexer } from "./fetchService";

export type BalancesFilter = object;
export type BalancesOrder = string;

export async function getBalances(
	filter: BalancesFilter | undefined,
	order: BalancesOrder = "ID_ASC",
	pagination: PaginationOptions
) {
	const offset = pagination.offset;

	const response = await fetchIndexer<{ accounts: ResponseItems<AccountResponse> }>(
		`query ($first: Int!, $offset: Int!, $filter: AccountFilter, $order: [AccountsOrderBy!]!) {
			accounts(first: $first, offset: $offset, filter: $filter, orderBy: $order) {
				nodes {
                    address
                    createdAt
                    updatedAt
                    balanceFree
                    balanceReserved
                    balanceStaked
                    balanceTotal
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				${filter !== undefined ? "totalCount" : ""}
			}
		}`,
		{
			first: pagination.limit,
			offset,
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
		reserved: item.balanceReserved,
		staked: item.balanceStaked,
		total: item.balanceTotal,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt
	} as Balance;
};

export async function getBalance(filter: BalancesFilter) {
	const response = await fetchIndexer<{ accounts: ResponseItems<AccountResponse> }>(
		`query ($filter: AccountFilter) {
			accounts(first: 1, offset: 0, filter: $filter, orderBy: ID_DESC) {
				nodes {
                    address
                    createdAt
                    updatedAt
                    balanceFree
                    balanceReserved
                    balanceStaked
                    balanceTotal
				}
			}
		}`,
		{
			filter,
		}
	);

	const data = response.accounts?.nodes[0] && transformItem(response.accounts.nodes[0]);
	return data;
}