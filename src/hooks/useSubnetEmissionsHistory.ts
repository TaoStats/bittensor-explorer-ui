import { useState, useEffect, useCallback } from "react";
import { getSubnetEmissionsHistory } from "../services/subnetsService";

import { useRollbar } from "@rollbar/react";
import { DataError } from "../utils/error";
import {
	SubnetEmissionsHistory,
	SubnetEmissionsHistoryPaginatedResponse,
	SubnetEmissionsHistoryResponse,
} from "../model/subnet";

export function useSubnetEmissionsHistory(): SubnetEmissionsHistoryResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<SubnetEmissionsHistory[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			const subnets = await getSubnetEmissionsHistory(
				undefined,
				"HEIGHT_DESC",
				"SUBNET_ID"
			);
			subnets.data.sort((x, y) => {
				const xEmission = parseInt(x.emission.toString());
				const yEmission = parseInt(y.emission.toString());
				if (xEmission > yEmission) return -1;
				if (xEmission == yEmission) return 0;
				return 1;
			});
			const subnetIds = subnets.data.slice(0, 12).map((x) => x.subnetId);

			const limit = 100;

			let finished = false;
			let after: string | undefined = undefined;

			const now = Date.now();
			const from = new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString();

			const result: SubnetEmissionsHistory[] = [];
			while (!finished) {
				const stats: SubnetEmissionsHistoryPaginatedResponse =
					await getSubnetEmissionsHistory(
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
	};
}
