import { isAddress } from "@polkadot/util-crypto";

import { Account } from "../model/account";
import { addRuntimeSpec } from "../utils/addRuntimeSpec";
import { DataError } from "../utils/error";
import { decodeAddress } from "../utils/formatAddress";

export async function getAccount(address: string): Promise<Account | undefined> {
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
		identity: null
	};

	// data.identity = await getAccountIdentity(network, address);

	const account = await addRuntimeSpec(data, () => "latest");

	return account;
}
