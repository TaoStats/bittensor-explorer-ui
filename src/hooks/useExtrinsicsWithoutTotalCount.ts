import { FetchOptions } from "../model/fetchOptions";
import { ExtrinsicsFilter, ExtrinsicsOrder, getExtrinsics } from "../services/extrinsicsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useExtrinsicsWithoutTotalCount(
	filter: ExtrinsicsFilter | undefined,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getExtrinsics, [filter, order, false], options);
}
