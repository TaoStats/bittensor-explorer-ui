import { FetchOptions } from "../model/fetchOptions";
import { BlocksFilter, BlocksOrder, getBlocks } from "../services/blocksService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useBlocks(
	filter: BlocksFilter | undefined,
	order?: BlocksOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getBlocks, [filter, order], options);
}
