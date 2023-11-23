export type AccountResponse = {
	address: string;
	createdAt: bigint;
	updatedAt: bigint;
	balanceFree: bigint;
	balanceStaked: bigint;
	balanceTotal: bigint;
};

export type AccountBalance = {
	free: bigint;
	staked: bigint;
	total: bigint;
}

export type Balance = AccountBalance & {
	id: string;
	address: string;
}
