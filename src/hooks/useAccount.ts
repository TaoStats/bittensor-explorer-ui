import { FetchOptions } from "../model/fetchOptions";
import { getAccount } from "../services/accountService";

import { useResource } from "./useResource";

export function useAccount(
	address: string,
	options?: FetchOptions
) {
	return useResource(getAccount, [address], options);
}
