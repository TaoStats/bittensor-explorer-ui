import { useState, useEffect, useCallback } from "react";
import { getAccountStats } from "../services/accountService";

import { useRollbar } from "@rollbar/react";
import { DataError } from "../utils/error";
import { AccountStats, AccountStatsResponse } from "../model/accountStats";

export function useAccountStats(): AccountStatsResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<AccountStats[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			let offset = 0;
			let finished = false;
			const limit = 100;
			const result: AccountStats[] = [];
			while (!finished) {
				const stats = await getAccountStats(offset, limit);
				result.push(...stats.data);
				finished = !stats.hasNextPage;
				offset += limit;
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
