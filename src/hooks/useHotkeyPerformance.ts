import { useRollbar } from "@rollbar/react";
import { useState, useCallback, useEffect } from "react";
import {
	NeuronPerformance,
	NeuronPerformancePaginatedResponse,
	NeuronPerformanceResponse,
} from "../model/subnet";
import { getNeuronPerformance } from "../services/subnetsService";
import { DataError } from "../utils/error";

export function useHotkeyPerformance(
	hotkey: string,
	netUid: number
): NeuronPerformanceResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<NeuronPerformance[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async (hkey: string, subnetId: number) => {
		try {
			let finished = false;
			let after: string | undefined = undefined;

			const now = Date.now();
			const from = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

			const result: NeuronPerformance[] = [];
			while (!finished) {
				const performance: NeuronPerformancePaginatedResponse =
					await getNeuronPerformance(
						{
							hotkey: {
								equalTo: hkey,
							},
							netUid: {
								equalTo: subnetId,
							},
							timestamp: {
								greaterThan: new Date(from).toISOString().substring(0, 19),
							},
						},
						"HEIGHT_ASC",
						after
					);
				result.push(...performance.data);
				finished = !performance.hasNextPage;
				after = performance.endCursor;
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
		fetchData(hotkey, netUid);
	}, [fetchData, hotkey, netUid]);

	return {
		loading,
		error,
		data,
	};
}
