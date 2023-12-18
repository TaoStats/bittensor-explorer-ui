import { useState, useEffect, useCallback } from "react";
import { getTokenStats } from "../services/tokenService";

import { useRollbar } from "@rollbar/react";
import { DataError } from "../utils/error";
import { TokenStats, TokenStatsPaginatedResponse, TokenStatsResponse } from "../model/tokenStats";

export function useTokenStats(): TokenStatsResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<TokenStats[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			const limit = 100;

			let finished = false;
			let after: string | undefined = undefined;

			const result: TokenStats[] = [];
			while (!finished) {
				const stats: TokenStatsPaginatedResponse = await getTokenStats(
					after,
					limit
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
