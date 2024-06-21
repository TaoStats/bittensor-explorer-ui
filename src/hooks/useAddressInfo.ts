import { useRollbar } from "@rollbar/react";
import { useState, useCallback, useEffect } from "react";
import { NeuronMetagraph } from "../model/subnet";
import { getNeuronMetagraph } from "../services/subnetsService";
import { DataError } from "../utils/error";

import { ItemsResponse } from "../model/itemsResponse";
import { rawAmountToDecimal } from "../utils/number";

export function useAddressInfo(address: string) {
	const rollbar = useRollbar();

	const [data, setData] = useState<{ isHotkey: boolean; isValidator: boolean }>(
		{ isHotkey: false, isValidator: false }
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			const result: ItemsResponse<NeuronMetagraph> = await getNeuronMetagraph(
				{
					hotkey: {
						equalTo: address,
					},
					netUid: {
						notEqualTo: 0,
					},
				},
				"NET_UID_ASC",
				{
					limit: 1024,
				}
			);
			const isValidator =
				result.data.find(
					(cur) =>
						cur.dividends > 0 &&
						rawAmountToDecimal(cur.stake.toString()).gt(1000)
				) != undefined;
			const isHotkey = result.data.length > 0;
			setData({ isHotkey, isValidator });
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
		setData({ isHotkey: false, isValidator: false });
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
