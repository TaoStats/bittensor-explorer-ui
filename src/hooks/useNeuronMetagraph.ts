import { FetchOptions } from "../model/fetchOptions";
import {
	NeuronMetagraphFilter,
	NeuronMetagraphOrder,
	getNeuronMetagraph,
} from "../services/subnetsService";

import { useFullPaginatedResource } from "./useFullPaginatedResource";

export function useNeuronMetagraph(
	filter: NeuronMetagraphFilter | undefined,
	order?: NeuronMetagraphOrder,
	options?: FetchOptions
) {
	return useFullPaginatedResource(
		getNeuronMetagraph,
		[filter, order],
		options,
		25
	);
}
