import { useEffect } from "react";

import { FetchOptions } from "../model/fetchOptions";
import { getTaoPrice, getPriceUpdatedAt, USD_RATES_REFRESH_RATE } from "../services/taoPriceService";

import { useResource } from "./useResource";

export function useTaoPrice(
	options?: FetchOptions
) {
	const taoPrice = useResource(getTaoPrice, [], options);

	console.log("useTaoPrice: ", taoPrice);

	useEffect(() => {
		if (taoPrice.data) {
			const nextRefetchAt = getPriceUpdatedAt() + USD_RATES_REFRESH_RATE;
			const timeout = setTimeout(taoPrice.refetch, Math.max(0, nextRefetchAt - Date.now()));
			return () => clearTimeout(timeout);
		}
	}, [taoPrice]);

	return taoPrice;
}
