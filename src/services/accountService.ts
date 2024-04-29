import { isAddress } from "@polkadot/util-crypto";

import { Account } from "../model/account";
import { addRuntimeSpec } from "../utils/addRuntimeSpec";
import { DataError } from "../utils/error";
import { decodeAddress } from "../utils/formatAddress";
import {
	AccountStats,
	AccountStatsPaginatedResponse,
} from "../model/accountStats";
import { ResponseItems } from "../model/itemsConnection";
import { fetchHistorical } from "./fetchService";

export async function getAccount(
	address: string
): Promise<Account | undefined> {
	if (!isAddress(address)) {
		throw new DataError("Invalid account address");
	}

	// if the address is encoded, decode it
	const decodedAddress = decodeAddress(address);

	if (decodedAddress) {
		address = decodedAddress;
	}

	const data: Omit<Account, "runtimeSpec"> = {
		id: address,
		address,
		identity: null,
	};

	// data.identity = await getAccountIdentity(network, address);

	const account = await addRuntimeSpec(data, () => "latest");

	return account;
}

export async function getAccountStats(
	after?: string
): Promise<AccountStatsPaginatedResponse> {
	const response = await fetchHistorical<{
		accountStats: ResponseItems<AccountStats>;
	}>(
		`query($after: Cursor) {
			accountStats(after: $after, orderBy: HEIGHT_ASC) {
				pageInfo {
					hasNextPage
					endCursor
				}
				nodes {
				  height
				  active
				  holders
				  total
				  activeHolders
				  id
				  timestamp
				}
			  }
		}`,
		{
			after,
		}
	);

	return {
		hasNextPage: response.accountStats?.pageInfo.hasNextPage,
		endCursor: response.accountStats?.pageInfo.endCursor,
		data: response.accountStats?.nodes,
	};
}
