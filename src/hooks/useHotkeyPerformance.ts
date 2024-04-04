import { useRollbar } from "@rollbar/react";
import { useState, useCallback, useEffect } from "react";
import { NeuronPerformance } from "../model/subnet";
import { getNeuronPerformance } from "../services/subnetsService";
import { DataError } from "../utils/error";

import { ItemsResponse } from "../model/itemsResponse";

export function useHotkeyPerformance(hotkey: string, netUid: number) {
	const rollbar = useRollbar();

	const [data, setData] = useState<NeuronPerformance[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async (hkey: string, subnetId: number) => {
		try {
			const result: ItemsResponse<NeuronPerformance> =
				await getNeuronPerformance(
					{
						hotkey: {
							equalTo: hkey,
						},
						netUid: {
							equalTo: subnetId,
						},
					},
					"HEIGHT_ASC",
					{
						limit: 1024,
					}
				);
			setData(result.data);
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
