import { FetchOptions } from "../model/fetchOptions";
import { getRuntimeSpecs } from "../services/runtimeService";
import { useResource } from "./useResource";

export function useRuntimeSpecs(
	specVersions: number[] | undefined,
	options?: FetchOptions
) {
	return useResource(getRuntimeSpecs, [specVersions], options);
}
