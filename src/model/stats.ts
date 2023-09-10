export type Tokenomics = {
	price: number;
	priceChange24h: number;
	volume24h: number;
	marketCap: number;
	stakingAPY: number;
	validationAPY: number;
	totalSupply: number;
	currentSupply: number;
	delegatedSupply: number;
};

export type ChainStats = {
	blocksFinalized: bigint;
	extrinsicsSigned: bigint;
	activeAccounts: bigint;
	transfers: bigint;
};

export type Stats = {
	token: Tokenomics;
	chain: ChainStats;
}
