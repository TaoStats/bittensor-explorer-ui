import { useRollbar } from "@rollbar/react";
import { getColdkeySubnets } from "../services/subnetsService";

import { useCallback, useEffect, useState } from "react";
import {
	ColdkeySubnetPaginatedResponse,
	NeuronMetagraph,
} from "../model/subnet";
import { DataError } from "../utils/error";

export function useColdKeySubnets(coldkey: string) {
	const rollbar = useRollbar();

	const [data, setData] = useState<NeuronMetagraph[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			let finished = false;
			let after: string | undefined = undefined;

			const result: NeuronMetagraph[] = [];
			while (!finished) {
				const stats: ColdkeySubnetPaginatedResponse = await getColdkeySubnets(
					coldkey,
					after
				);
				result.push(...stats.data);
				finished = !stats.hasNextPage;
				after = stats.endCursor;
			}
			setData(result);
		} catch (e) {
			if (e instanceof DataError) {
				rollbar.error(e);
				setError(e);
			} else {
				throw e;
			}
		}

		setLoading(false);
	}, []);

	useEffect(() => {
		setData([]);
		setError(undefined);
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return {
		loading,
		error,
		data,
	};
}
