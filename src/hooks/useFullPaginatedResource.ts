import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRollbar } from "@rollbar/react";

import { FetchOptions } from "../model/fetchOptions";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginatedResource } from "../model/paginatedResource";
import { PaginationOptions } from "../model/paginationOptions";
import { DataError } from "../utils/error";

import { usePagination } from "./usePagination";

export function useFullPaginatedResource<T = any, F extends any[] = any[]>(
	fetchItems: (
		...args: [...F, PaginationOptions]
	) => ItemsResponse<T> | Promise<ItemsResponse<T>>,
	args: F,
	options?: FetchOptions,
	limit?: number
) {
	const rollbar = useRollbar();

	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>();

	const pagination = usePagination(limit, true);

	const argsRef = useRef(args);
	const paginationRef = useRef(pagination);

	const fetchData = useCallback(async () => {
		argsRef.current = args;
		paginationRef.current = pagination;

		const timer = setTimeout(async () => {
			if (args !== argsRef.current || pagination !== paginationRef.current)
				return;

			if (options?.waitUntil) {
				// wait until all required condition are met
				return;
			}

			if (!options?.skip) {
				try {
					const items = await fetchItems(...args, {
						limit: pagination.limit,
						offset: pagination.offset,
					});

					setData(items.data);
					pagination.set(items.pagination);
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
		}, 100);
		return () => clearTimeout(timer);
	}, [
		fetchItems,
		JSON.stringify(args),
		pagination.limit,
		pagination.page,
		options?.skip,
	]);

	useEffect(() => {
		setData([]);
		setError(undefined);
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return useMemo(
		() =>
			({
				data,
				loading,
				notFound: !loading && !error && (!data || data.length === 0),
				pagination,
				error,
				refetch: fetchData,
			} as PaginatedResource<T>),
		[data, loading, pagination, error, fetchData]
	);
}
