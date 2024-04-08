import { FetchOptions } from "../model/fetchOptions";
import {
	NeuronMetagraphFilter,
	getColdkeySubnets,
} from "../services/subnetsService";

import { useResource } from "./useResource";

export function useColdKeySubnets(
	filter: NeuronMetagraphFilter,
	options?: FetchOptions
) {
	return useResource(getColdkeySubnets, [filter], options);
}
