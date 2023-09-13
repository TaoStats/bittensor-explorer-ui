import { useEffect, useState } from "react";
import { useApi } from "../contexts";

export function useValidatorStaked(hotkey: any, coldkey: any) {
	const {
		state: { api, apiState },
	} = useApi();
	const [staked, setStaked] = useState<any>(undefined);
	const [unsub, setUnsub] = useState<any>(undefined);

	const subscribeValidatorStaked = async () => {
		if (!api || apiState !== "READY") return;
		const _unsub = await api.query.subtensorModule?.stake(
			hotkey,
			coldkey,
			(value: any) => {
				if (!value || value.isEmpty) {
					console.log("Failed to get cold key");
					return;
				}
				value && setStaked(value.toString());
			}
		);
		setUnsub(_unsub);
	};

	useEffect(() => {
		if(!coldkey) return;
		subscribeValidatorStaked();
		return () => { 
			if (unsub) unsub.then();
		};
	}, [hotkey, coldkey, apiState]);

	return staked;
}
