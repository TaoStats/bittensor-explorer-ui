import { ChainStats, Stats, Tokenomics } from "./../model/stats";
import { TAOSTATS_DATA_ENDPOINT } from "../config";
import { fetchDictionary, fetchIndexer } from "./fetchService";
import { ResponseItems } from "../model/itemsConnection";

type DictionaryStats = {
	blocksFinalized: bigint;
	extrinsicsSigned: bigint;
};

type IndexerStats = {
	accounts: bigint;
	transfers: bigint;
};

async function getDictionaryStats(): Promise<DictionaryStats> {
	const response = await fetchDictionary<{
		stats: ResponseItems<DictionaryStats>;
	}>(
		`{
			stats {
				nodes {
					blocksFinalized
					extrinsicsSigned
				}
			}
		}`
	);
	const data = response.stats.nodes[0];
	return data ?? { blocksFinalized: BigInt(0), extrinsicsSigned: BigInt(0) };
}

async function getIndexerStats(): Promise<IndexerStats> {
	const response = await fetchIndexer<{
		stats: ResponseItems<IndexerStats>;
	}>(
		`{
			stats {
				nodes {
					accounts
					transfers
				}
			}
		}`
	);
	const data = response.stats.nodes[0];
	return data ?? { accounts: BigInt(0), transfers: BigInt(0) };
}

export async function getStats(): Promise<Stats> {
	const getTokenomics = async (): Promise<Tokenomics> => {
		const res = await fetch(TAOSTATS_DATA_ENDPOINT);
		const [data] = await res.json();

		return {
			price: data["price"],
			priceChange24h: data["24h_change"],
			marketCap: data["market_cap"],
			stakingAPY: data["staking_apy"],
			validationAPY: data["validating_apy"],
			totalSupply: parseInt(data["total_supply"]),
			currentSupply: parseInt(data["current_supply"]),
			delegatedSupply: parseInt(data["delegated_supply"]),
			volume24h: data["24h_volume"]
		} as Tokenomics;
	};

	const getChainStats = async (): Promise<ChainStats> => {
		// const dict = await getDictionaryStats();
		const indexer = await getIndexerStats();

		return {
			// ...dict,
			...indexer
		} as ChainStats;
	};

	const token = await getTokenomics();
	const chain = await getChainStats();

	return {
		token,
		chain,
	} as Stats;
}
