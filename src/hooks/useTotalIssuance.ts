import Decimal from "decimal.js";
import { useState } from "react";
import { useApi } from "../contexts";
import { rawAmountToDecimal } from "../utils/number";

export function useTotalIssuance() {
	const {
		state: { api, apiState },
	} = useApi();
	const [totalIssuance, setTotalIssuance] = useState<Decimal>();

	const fetchTotalIssuance = async () => {
		if (!api || apiState !== "READY") return;
		const value = await api.query.subtensorModule?.totalIssuance();
		setTotalIssuance(rawAmountToDecimal(value.toString()));
	};

	setTimeout(fetchTotalIssuance, 12 * 1000);

	return totalIssuance;
}
