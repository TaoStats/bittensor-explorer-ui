import { FetchOptions } from "../model/fetchOptions";
import { BalancesFilter, BalancesOrder, getBalances } from "../services/balancesService";
import { usePaginatedResource } from "./usePaginatedResource";

export function useBalances(
	network: string,
	filter: BalancesFilter | undefined,
	order?: BalancesOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getBalances, [network, filter, order], options);
}
