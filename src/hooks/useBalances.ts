import { FetchOptions } from "../model/fetchOptions";
import { BalancesFilter, BalancesOrder, getBalances } from "../services/balancesService";
import { usePaginatedResource } from "./usePaginatedResource";

export function useBalances(
	filter: BalancesFilter | undefined,
	order?: BalancesOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getBalances, [filter, order], options);
}
