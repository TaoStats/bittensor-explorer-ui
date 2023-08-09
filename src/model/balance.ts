import Decimal from "decimal.js";

export type Balance = {
	free: Decimal;
	reserved: Decimal;
	staked: Decimal;
	total: Decimal;
	updatedAt: bigint;
}
