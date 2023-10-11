import Decimal from "decimal.js";
import { useEffect, useState } from "react";
import { useApi } from "../contexts";
import { rawAmountToDecimal } from "../utils/number";

export function useDelegatedSupply() {
	const {
		state: { api, apiState },
	} = useApi();
	const [delegated, setDelegated] = useState<Decimal>();
	const [unsub, setUnsub] = useState<any>(undefined);

	const subscribeDelegatedSupply = async () => {
		if (!api || apiState !== "READY") return;
		const _unsub = await api.query.subtensorModule?.totalStake((value: any) => {
			value && setDelegated(rawAmountToDecimal(value.toString()));
		});
		setUnsub(_unsub);
	};

	useEffect(() => {
		subscribeDelegatedSupply();
		return () => {
			if (unsub) unsub.then();
		};
	}, [apiState]);

	return delegated;
}
