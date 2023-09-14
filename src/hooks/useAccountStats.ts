import { FetchOptions } from "../model/fetchOptions";
import { getAccountStats } from "../services/accountService";

import { useResource } from "./useResource";

export function useAccountStats(
	options?: FetchOptions
) {
	return useResource(getAccountStats, [], options);
}
