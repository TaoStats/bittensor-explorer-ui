import { ItemsResponse } from "../model/itemsResponse";
import { getRuntimeSpec, getRuntimeSpecs } from "../services/runtimeService";

import { uniq } from "./uniq";

// FIXME:
export async function addRuntimeSpec<T>(response: T | undefined, getSpecVersion: (data: T) => number | "latest") {
	if (response === undefined) {
		return undefined;
	}

	const specVersion = getSpecVersion(response);
	// FIXME:
	// const spec = await getRuntimeSpec(specVersion);
	const spec = {};

	return {
		...response,
		runtimeSpec: spec!
	};
}


export async function addRuntimeSpecs<T>(response: ItemsResponse<T>, getSpecVersion: (data: T) => number | "latest") {
	const specVersions = uniq(response.data.map(getSpecVersion));

	// FIXME:
	// const specs = await getRuntimeSpecs(specVersions);

	// const items = response.data.map(it => ({
	// 	...it,
	// 	runtimeSpec: specs[getSpecVersion(it)]!
	// }));

	const items = response.data.map(it => ({
		...it,
		runtimeSpec: {}
	}));


	return {
		...response,
		data: items
	};

}
