import { useState, useEffect, useCallback } from "react";
import { getAccountStats } from "../services/accountService";

import { useRollbar } from "@rollbar/react";
import { DataError } from "../utils/error";
import { AccountStats, AccountStatsPaginatedResponse, AccountStatsResponse } from "../model/accountStats";

export function useAccountStats(): AccountStatsResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<AccountStats[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			const limit = 100;

			let finished = false;
			let after: string | undefined = undefined;

			const result: AccountStats[] = [];
			while (!finished) {
				const stats: AccountStatsPaginatedResponse = await getAccountStats(
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
