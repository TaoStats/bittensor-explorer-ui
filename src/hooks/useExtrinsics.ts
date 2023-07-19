import { FetchOptions } from "../model/fetchOptions";
import { ExtrinsicsFilter, ExtrinsicsOrder, getExtrinsics } from "../services/extrinsicsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useExtrinsics(
	filter: ExtrinsicsFilter,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getExtrinsics, [filter, order, true], options);
}
