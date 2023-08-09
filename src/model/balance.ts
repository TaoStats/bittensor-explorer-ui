import Decimal from "decimal.js";

export type AccountResponse = {
	address: string;
	createdAt: bigint;
	updatedAt: bigint;
	balanceFree: bigint;
	balanceReserved: bigint;
	blaanceStaked: bigint;
	balanceTotal: bigint;
};

export type AccountBalance = {
	free: bigint;
	reserved: bigint;
	staked: bigint;
	total: bigint;
}

export type Balance = AccountBalance & {
	id: string;
	address: string;
	createdAt: bigint;
	updatedAt: bigint;
}
