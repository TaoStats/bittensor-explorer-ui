import { useRollbar } from "@rollbar/react";
import { useState, useCallback, useEffect } from "react";
import { NeuronMetagraph } from "../model/subnet";
import { getNeuronMetagraph } from "../services/subnetsService";
import { DataError } from "../utils/error";

import { ItemsResponse } from "../model/itemsResponse";

export function useHotkeyNet(hotkey: string) {
	const rollbar = useRollbar();

	const [data, setData] = useState<NeuronMetagraph[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			const result: ItemsResponse<NeuronMetagraph> = await getNeuronMetagraph(
				{
					hotkey: {
						equalTo: hotkey,
					},
				},
				"NET_UID_ASC",
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
		fetchData();
	}, [fetchData]);

	return {
		loading,
		error,
		data,
	};
}
