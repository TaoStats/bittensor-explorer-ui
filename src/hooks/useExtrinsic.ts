import { FetchOptions } from "../model/fetchOptions";
import { ExtrinsicsFilter, getExtrinsic } from "../services/extrinsicsService";

import { useResource } from "./useResource";

export function useExtrinsic(
	filter: ExtrinsicsFilter,
	options?: FetchOptions
) {
	return useResource(getExtrinsic, [filter], options);
}
