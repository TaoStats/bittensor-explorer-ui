import Decimal from "decimal.js";
import { useState } from "react";
import { useApi } from "../contexts";
import { rawAmountToDecimal } from "../utils/number";

export function useDelegatedSupply() {
	const {
		state: { api, apiState },
	} = useApi();
	const [delegated, setDelegated] = useState<Decimal>();

	const fetchDelegatedSupply = async () => {
		if (!api || apiState !== "READY") return;
		const value = await api.query.subtensorModule?.totalStake();
		setDelegated(rawAmountToDecimal(value.toString()));
	};

	setTimeout(fetchDelegatedSupply, 12 * 1000);

	return delegated;
}
