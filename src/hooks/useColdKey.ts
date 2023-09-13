import { useEffect, useState } from "react";
import { useApi } from "../contexts";

export function useColdKey(hotkey: string) {
	const {
		state: { api, apiState },
	} = useApi();
	const [coldKey, setColdKey] = useState<any>(undefined);
	const [unsub, setUnsub] = useState<any>(undefined);

	const subscribeColdKey = async () => {
		if (!api || apiState !== "READY") return;
		const _unsub = await api.query.subtensorModule?.owner(
			hotkey, 
			(value: any) => {
				if (!value || value.isEmpty) {
					console.log("Failed to get cold key");
					return;
				}
				value && setColdKey(value.toHuman());
			}
		);
		setUnsub(_unsub);
	};

	useEffect(() => {
		subscribeColdKey();
		return () => { 
			if (unsub) unsub.then();
		};
	}, [hotkey, apiState]);

	return coldKey;
}
