import { FetchOptions } from "../model/fetchOptions";
import { DelegateBalanceFilter, getValidatorBalances } from "../services/delegateService";
import { useResource } from "./useResource";

export function useValidatorBalance(
	filter: DelegateBalanceFilter | undefined,
	options?: FetchOptions
) {
	return useResource(getValidatorBalances, [filter], options);
}
