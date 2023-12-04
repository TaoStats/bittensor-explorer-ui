import { FetchOptions } from "../model/fetchOptions";
import { ValidatorsFilter, getValidator } from "../services/validatorService";

import { useResource } from "./useResource";

export function useValidator(
	filter: ValidatorsFilter,
	options?: FetchOptions) {
	return useResource(getValidator, [filter], options);
}
