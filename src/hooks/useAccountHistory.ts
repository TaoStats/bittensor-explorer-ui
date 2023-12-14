import { useState, useEffect, useCallback } from "react";
import {
	getAccountBalanceHistory,
	getAccountDelegateHistory,
} from "../services/accountHistoryService";

import { useRollbar } from "@rollbar/react";
import { DataError } from "../utils/error";
import {
	AccountBalanceHistory,
	AccountBalanceHistoryPaginatedResponse,
	AccountBalanceHistoryResponse,
	AccountDelegateHistory,
	AccountDelegateHistoryPaginatedResponse,
	AccountDelegateHistoryResponse,
} from "../model/accountHistory";

export function useAccountBalanceHistory(
	address: string
): AccountBalanceHistoryResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<AccountBalanceHistory[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			const limit = 100;

			let finished = false;
			let after: string | undefined = undefined;

			const result: AccountBalanceHistory[] = [];
			while (!finished) {
				const stats: AccountBalanceHistoryPaginatedResponse =
          await getAccountBalanceHistory(address, after, limit);
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

export function useAccountDelegateHistory(
	address: string
): AccountDelegateHistoryResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<AccountDelegateHistory[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			const limit = 100;

			let finished = false;
			let after: string | undefined = undefined;

			const result: AccountDelegateHistory[] = [];
			while (!finished) {
				const stats: AccountDelegateHistoryPaginatedResponse = await getAccountDelegateHistory(address, after, limit);
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
