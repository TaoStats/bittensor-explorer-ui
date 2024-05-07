import { FetchOptions } from "../model/fetchOptions";
import {
	RootValidatorFilter,
	RootValidatorOrder,
	getRootValidators,
} from "../services/subnetsService";

import { useFullPaginatedResource } from "./useFullPaginatedResource";

export function useRootValidators(
	filter: RootValidatorFilter | undefined,
	limit: number,
	order?: RootValidatorOrder,
	options?: FetchOptions
) {
	return useFullPaginatedResource(
		getRootValidators,
		[filter, order],
		options,
		limit
	);
}
