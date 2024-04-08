import { FetchOptions } from "../model/fetchOptions";
import {
	NeuronMetagraphFilter,
	getColdkeyInfo,
} from "../services/subnetsService";

import { useResource } from "./useResource";

export function useColdKeyInfo(
	filter: NeuronMetagraphFilter,
	options?: FetchOptions
) {
	return useResource(getColdkeyInfo, [filter], options);
}
