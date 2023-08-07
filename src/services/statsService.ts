import { TAOSTATS_DATA_ENDPOINT } from "../config";
import { Stats } from "../model/stats";

export async function getStats() {
	const res = await fetch(TAOSTATS_DATA_ENDPOINT);
	const [data] = await res.json();

	return {
		price: data["price"],
		priceChange24h: data["24h_change"],
		marketCap: data["market_cap"],
		stakingAPY: data["staking_apy"],
		validationAPY: data["validating_apy"],
		totalSupply: data["total_supply"],
		currentSupply: data["current_supply"],
		volume24h: data["24h_volume"],
	} as Stats;
}