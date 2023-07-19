import { FetchOptions } from "../model/fetchOptions";
import { getTransfers, TransfersFilter, TransfersOrder } from "../services/transfersService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useTransfers(
	filter: TransfersFilter | undefined,
	order?: TransfersOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getTransfers, [filter, order], options);
}
