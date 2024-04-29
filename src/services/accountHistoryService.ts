import { isAddress } from "@polkadot/util-crypto";
import { fetchHistorical } from "./fetchService";
import {
	AccountBalanceHistory,
	AccountBalanceHistoryPaginatedResponse,
	AccountDelegateHistory,
	AccountDelegateHistoryPaginatedResponse,
} from "../model/accountHistory";
import { ResponseItems } from "../model/itemsConnection";
import { DataError } from "../utils/error";

export async function getAccountBalanceHistory(
	address: string,
	after?: string
): Promise<AccountBalanceHistoryPaginatedResponse> {
	if (!isAddress(address)) {
		throw new DataError("Invalid account address");
	}

	const response = await fetchHistorical<{
		accountBalances: ResponseItems<AccountBalanceHistory>;
	}>(
		`query($after: Cursor) {
			accountBalances(after: $after, filter: {address: {equalTo: "${address}"}}, orderBy: HEIGHT_ASC) {
				nodes {
					balanceFree
					balanceStaked
					balanceTotal
					timestamp
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			  }
		}`,
		{
			after,
		}
	);

	return {
		hasNextPage: response.accountBalances?.pageInfo.hasNextPage,
		endCursor: response.accountBalances?.pageInfo.endCursor,
		data: response.accountBalances?.nodes,
	};
}

export async function getAccountDelegateHistory(
	address: string,
	after?: string
): Promise<AccountDelegateHistoryPaginatedResponse> {
	if (!isAddress(address)) {
		throw new DataError("Invalid account address");
	}

	const response = await fetchHistorical<{
		delegates: ResponseItems<AccountDelegateHistory>;
	}>(
		`query($after: Cursor) {
			delegates(after: $after, filter: {amount: {greaterThan: "0"}, account: {equalTo: "${address}"}}, orderBy: HEIGHT_ASC) {
				nodes {
					timestamp
					amount
					delegate
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			  }
		}`,
		{
			after,
		}
	);

	return {
		hasNextPage: response.delegates?.pageInfo.hasNextPage,
		endCursor: response.delegates?.pageInfo.endCursor,
		data: response.delegates?.nodes,
	};
}
