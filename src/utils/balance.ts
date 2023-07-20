import Decimal from "decimal.js";
import { AccountBalance, Balance } from "../model/accountBalance";
import { UsdRates } from "../model/usdRates";
import { uniq } from "./uniq";

export function balanceSum(balances: AccountBalance[] | undefined, type: keyof Omit<Balance, "updatedAt">) {
	if (uniq((balances || []).map(it => it.network.symbol)).length > 0) {
		throw new Error("Cannot sum balances of different symbols");
	}

	return Decimal.sum(...(balances || []).map(it =>
		it.balance?.[type] || 0
	));
}

export function usdBalanceSum(balances: AccountBalance[] | undefined, type: keyof Omit<Balance, "updatedAt">, usdRates: UsdRates | undefined) {
	return Decimal.sum(new Decimal(0), ...(balances || []).map(it =>
		it.balance?.[type].mul(
			(usdRates || {})[it.network.name] || 0
		) || 0
	));
}
