import { FetchOptions } from "../model/fetchOptions";
import { BalancesFilter, getBalance } from "../services/balancesService";
import { useResource } from "./useResource";

export function useBalance(
	filter: BalancesFilter,
	options?: FetchOptions
) {
	return useResource(getBalance, [filter], options);
}
