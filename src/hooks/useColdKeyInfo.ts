import { useRollbar } from "@rollbar/react";
import { ColdkeyInfo, ColdkeyInfoPaginatedResponse } from "../model/subnet";
import { useCallback, useEffect, useState } from "react";
import { DataError } from "../utils/error";
import { getColdkeyInfo } from "../services/subnetsService";

export function useColdKeyInfo(coldkey: string) {
	const rollbar = useRollbar();

	const [data, setData] = useState<ColdkeyInfo[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			let finished = false;
			let after: string | undefined = undefined;

			const result: ColdkeyInfo[] = [];
			while (!finished) {
				const stats: ColdkeyInfoPaginatedResponse = await getColdkeyInfo(
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
