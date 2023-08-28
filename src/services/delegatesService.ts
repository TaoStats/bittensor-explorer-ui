import { ApiPromise } from "@polkadot/api";
import { DelegateItem } from "../model/delegates";
import { rawAmountToDecimal } from "../utils/number";

interface ValidatorInfo {
	hotkey: string;
	name: string;
	url: string;
	description: string;
	signature: string;
}

export async function getDelegated(api: ApiPromise, address: string): Promise<DelegateItem[]> {
	const fetchHotkeyColdkeyStake = async (hotkey: string, address: string) => {
		if (!api || !api.isReady || !api.query?.subtensorModule?.stake) return 0;

		const res = await api.query.subtensorModule.stake(hotkey, address);

		if (res.isEmpty) return 0;
		else {
			const amount = res.toString();
			return rawAmountToDecimal(amount);
		}
	};
	const fetchStakeFromDelegates = async (delegates: ValidatorInfo[], address: string) => {
		const staked = [];
		for await (const delegate of delegates) {
			const { hotkey, name } = delegate;
			const amount = await fetchHotkeyColdkeyStake(hotkey, address);
			if (!amount) continue;
			staked.push({
				name,
				hotkey,
				amount,
			});
		}
		return staked;
	};
	const delegates = await loadDelegates();
	return fetchStakeFromDelegates(delegates, address);
}


const loadDelegates = async (): Promise<ValidatorInfo[]> => {
	const res = await fetch("https://raw.githubusercontent.com/opentensor/bittensor-delegates/main/public/delegates.json", {
		method: "GET",
	});

	if (res.status !== 200) return [];

	const data = await res.json();
	const list = Object.entries(data).map(
		([hotkey, value]) =>
			({
				hotkey,
				...(value as any)
			} as ValidatorInfo)
	);
	return list;
};