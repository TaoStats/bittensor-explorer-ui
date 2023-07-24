import { ItemsResponse } from "../model/itemsResponse";
import { getRuntimeSpec, getRuntimeSpecs } from "../services/runtimeService";

import { uniq } from "./uniq";

// FIXME:
export async function addRuntimeSpec<T>(response: T | undefined, getSpecVersion: (data: T) => number | "latest") {
	if (response === undefined) {
		return undefined;
	}

	const specVersion = getSpecVersion(response);
	const spec = await getRuntimeSpec(specVersion);

	return {
		...response,
		runtimeSpec: spec!
	};
}


export async function addRuntimeSpecs<T>(response: ItemsResponse<T>, getSpecVersion: (data: T) => number | "latest") {
	const specVersions = uniq(response.data.map(getSpecVersion));
	const specs = await getRuntimeSpecs(specVersions);
	const items = response.data.map(it => ({
		...it,
		runtimeSpec: specs[getSpecVersion(it)]!
	}));
	return {
		...response,
		data: items
	};

}
