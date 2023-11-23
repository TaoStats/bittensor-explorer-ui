import { FetchOptions } from "../model/fetchOptions";
import { ValidatorFilter, getValidatorBalances } from "../services/delegateService";
import { useResource } from "./useResource";

export function useValidatorBalance(
	filter: ValidatorFilter | undefined,
	options?: FetchOptions
) {
	return useResource(getValidatorBalances, [filter], options);
}
