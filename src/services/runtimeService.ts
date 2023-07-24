import { RuntimeSpec, RuntimeSpecResponse } from "../model/runtimeSpec";
import { decodeMetadata } from "../utils/decodeMetadata";
import { uniq } from "../utils/uniq";
import { fetchDictionary } from "./fetchService";

export async function getRuntimeSpec(specVersion: "latest"): Promise<RuntimeSpec>;
export async function getRuntimeSpec(specVersion: number | "latest"): Promise<RuntimeSpec | undefined>;

export async function getRuntimeSpec(specVersion: number | "latest"): Promise<RuntimeSpec | undefined> {
	if (specVersion === "latest") {
		return getLatestRuntimeSpec();
	}

	const specs = await getRuntimeSpecs([specVersion]);
	return specs[specVersion];
}

export async function getLatestRuntimeSpec() {
	// FIXME:
	const response = await fetchDictionary<{ specVersions: { nodes: RuntimeSpecResponse[] } }>(
		`
			query {
				specVersions(orderBy: BLOCK_HEIGHT_DESC, first: 1) {
					nodes {
						id
						blockHeight
						hex
					}
				}
			}
		`
	);

	const spec = response.specVersions.nodes[0]!;

	return {
		...spec,
		metadata: decodeMetadata(spec.hex)
	};
}

export async function getRuntimeSpecs(
	specVersions: (number | "latest")[] | undefined
) {
	if (specVersions == undefined || specVersions.length === 0) {
		specVersions = [];
	}

	const specs: Record<number | string, RuntimeSpec> = {};

	if (specVersions.includes("latest")) {
		specs["latest"] = await getLatestRuntimeSpec();
		specVersions = specVersions.filter(it => it !== "latest");
	}

	const response = await fetchDictionary<{ specVersions: { nodes: RuntimeSpecResponse[] } }>(
		`
			query ($specVersions: [String!]!) {
				specVersions(filter: {id: {in: $specVersions} }, orderBy: BLOCK_HEIGHT_DESC) {
					nodes {
						id
						blockHeight
						hex
					}
				}
			}
		`,
		{
			specVersions: uniq(specVersions).map((version) => version.toString())
		}
	);

	for (const spec of response.specVersions.nodes) {
		specs[spec.id] = {
			id: spec.id,
			blockHeight: spec.blockHeight,
			metadata: decodeMetadata(spec.hex)
		};
	}

	return specs;
}
