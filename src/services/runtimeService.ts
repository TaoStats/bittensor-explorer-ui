import { RuntimeSpec } from "../model/runtimeSpec";
import { decodeMetadata } from "../utils/decodeMetadata";
import { uniq } from "../utils/uniq";
import { fetchDictionary } from "./fetchService";

export async function getRuntimeSpecVersions() {
	// FIXME:
	const response = await fetchDictionary<{ metadata: { specVersion: number }[] }>(
		`query {
				metadata(orderBy: specVersion_DESC) {
					specVersion
				}
			}
		`
	);

	return response.metadata.map(it => it.specVersion);
}

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
	const response = await fetchDictionary<{ spec: Omit<RuntimeSpec, "metadata">[] }>(
		`
			query {
				spec: metadata(orderBy: specVersion_DESC, limit: 1) {
					id
					blockHash
					blockHeight
					specName
					specVersion
					hex
				}
			}
		`
	);

	const spec = response.spec[0]!;

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

	// FIXME:
	const response = await fetchDictionary<{ specs: Omit<RuntimeSpec, "metadata">[] }>(
		`
			query ($specVersions: [Int!]!) {
				specs: metadata(where: {specVersion_in: $specVersions}, orderBy: specVersion_DESC) {
					id
					blockHash
					blockHeight
					specName
					specVersion
					hex
				}
			}
		`,
		{
			specVersions: uniq(specVersions)
		}
	);

	for (const spec of response.specs) {
		specs[spec.specVersion] = {
			...spec,
			metadata: decodeMetadata(spec.hex)
		};
	}

	return specs;
}
