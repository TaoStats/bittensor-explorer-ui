import { FetchOptions } from "../model/fetchOptions";
import { getRuntimeSpecVersions } from "../services/runtimeService";
import { useResource } from "./useResource";

export function useRuntimeSpecVersions(
	options?: FetchOptions
) {
	return useResource(getRuntimeSpecVersions, [], options);
}
