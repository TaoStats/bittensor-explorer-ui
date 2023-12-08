import { FetchOptions } from "../model/fetchOptions";
import { SubnetsFilter, SubnetsOrder, getSubnets } from "../services/subnetsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useSubnets(
	filter: SubnetsFilter | undefined,
	order?: SubnetsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getSubnets, [order], options);
}
