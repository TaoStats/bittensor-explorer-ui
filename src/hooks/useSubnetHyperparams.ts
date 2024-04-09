import { FetchOptions } from "../model/fetchOptions";
import {
	SubnetHyperparamsFilter,
	getSubnetHyperparams,
} from "../services/subnetsService";

import { useResource } from "./useResource";

export function useSubnetHyperparams(
	filter: SubnetHyperparamsFilter | undefined,
	options?: FetchOptions
) {
	return useResource(getSubnetHyperparams, [filter], options);
}
