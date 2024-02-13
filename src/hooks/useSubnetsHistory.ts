import { useState, useEffect, useCallback } from "react";
import { getSubnetHistory, getSubnets } from "../services/subnetsService";

import { useRollbar } from "@rollbar/react";
import { DataError } from "../utils/error";
import {
	SubnetHistory,
	SubnetHistoryPaginatedResponse,
	SubnetHistoryResponse,
} from "../model/subnet";

export function useSubnetsHistory(): SubnetHistoryResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<SubnetHistory[]>([]);
	const [ids, setIds] = useState<number[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			const subnets = await getSubnets(undefined, "EMISSION_DESC", {
				limit: 12,
			});
			const subnetIds = subnets.data.slice(0, 12).map((x) => x.netUid);
			setIds(subnetIds);

			const limit = 100;

			let finished = false;
			let after: string | undefined = undefined;

			const now = Date.now();
			const from = new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString();

			const result: SubnetHistory[] = [];
			while (!finished) {
				const stats: SubnetHistoryPaginatedResponse = await getSubnetHistory(
					{
						subnetId: {
							in: subnetIds,
						},
						timestamp: {
							greaterThan: from,
						},
					},
					"HEIGHT_ASC",
					undefined,
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
		ids,
	};
}
