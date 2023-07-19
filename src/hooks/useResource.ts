import { useRollbar } from "@rollbar/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { FetchOptions } from "../model/fetchOptions";
import { Resource } from "../model/resource";
import { DataError } from "../utils/error";

export function useResource<T = any, F extends any[] = any[]>(
	fetchItem: (...args: F) => T | undefined | Promise<T | undefined>,
	args: F,
	options?: FetchOptions
) {
	const rollbar = useRollbar();

	const [data, setData] = useState<T>();
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>();

	const fetchData = useCallback(async () => {
		if (options?.waitUntil) {
			// wait until all required condition are met
			return;
		}

		if (!options?.skip) {
			try {
				const data = await fetchItem(...args);
				setData(data);
			} catch (e) {
				if (e instanceof DataError) {
					rollbar.error(e);
					setError(e);
				} else {
					throw e;
				}
			}
		}

		setLoading(false);
	}, [fetchItem, JSON.stringify(args), options?.waitUntil, options?.skip]);

	useEffect(() => {
		setData(undefined);
		setError(undefined);
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return useMemo(
		() => ({
			data,
			loading,
			notFound: !loading && !error && !data,
			error,
			refetch: fetchData
		}) as Resource<T>,
		[data, loading, error, fetchData]
	);
}
