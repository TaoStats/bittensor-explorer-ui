import { RuntimeSpec, RuntimeSpecResponse } from "./../model/runtimeSpec";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchDictionary } from "../services/fetchService";
import { decodeMetadata } from "../utils/decodeMetadata";

export const useRuntimeSpec = (specVersion: number | undefined) => {
	const [runtimeSpec, setRuntimeSpec] = useState<RuntimeSpec>();
	const [loading, setLoading] = useState(false);

	const fetchData = useCallback(
		async () => {
			if (specVersion !== undefined) {
				setLoading(true);

				const res = await fetchDictionary<{ specVersions: { nodes: RuntimeSpecResponse[] } }>(
					`query ($filter: SpecVersionFilter) {
						specVersions(first: 1, offset: 0, filter: $filter) {
							nodes {
								id
								blockHeight
								hex
							}
						}
		       		}`,
					{
						filter: { id: { equalTo: specVersion.toString() } },
					}
				);

				const spec = res.specVersions.nodes[0];

				if (spec) {
					setRuntimeSpec({
						id: spec.id,
						blockHeight: spec.blockHeight,
						metadata: decodeMetadata(spec.hex)
					});
				}
				else {
					setRuntimeSpec(undefined);
				}

				setLoading(false);
			}
			else {
				setRuntimeSpec(undefined);
			}
		}, [specVersion]
	);

	useEffect(() => {
		setRuntimeSpec(undefined);
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return useMemo(() => ({ runtimeSpec, loading }), [runtimeSpec, loading]);
};