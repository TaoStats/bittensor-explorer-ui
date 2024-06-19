import { useRollbar } from "@rollbar/react";
import { useState, useCallback, useEffect } from "react";
import { NeuronMetagraph } from "../model/subnet";
import { getNeuronMetagraph } from "../services/subnetsService";
import { DataError } from "../utils/error";

import { ItemsResponse } from "../model/itemsResponse";
import { rawAmountToDecimal } from "../utils/number";

export function useAddressInfo(address: string) {
	const rollbar = useRollbar();

	const [data, setData] = useState<{
		loading: boolean;
		isHotkey: boolean;
		isValidator: boolean;
		isColdkey: boolean;
	}>({ loading: true, isHotkey: false, isValidator: false, isColdkey: false });
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			const result: ItemsResponse<NeuronMetagraph> = await getNeuronMetagraph(
				{
					or: [
						{ hotkey: { equalTo: address } },
						{ coldkey: { equalTo: address } },
					],
					netUid: {
						notEqualTo: 0,
					},
				},
				"NET_UID_ASC",
				{
					limit: 1024,
				}
			);

			const hotkeys = result.data.filter((x) => x.hotkey === address);
			const coldkeys = result.data.filter((x) => x.coldkey === address);
			const isValidator =
				hotkeys.find(
					(cur) =>
						cur.dividends > 0 &&
						rawAmountToDecimal(cur.stake.toString()).gt(1000)
				) != undefined;
			const isHotkey = hotkeys.length > 0;
			const isColdkey = coldkeys.length > 0;
			setData({ loading: false, isHotkey, isValidator, isColdkey });
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
		setData({
			loading: true,
			isHotkey: false,
			isValidator: false,
			isColdkey: false,
		});
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
