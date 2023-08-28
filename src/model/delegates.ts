import Decimal from "decimal.js";

export type DelegateItem = {
	name: string;
	hotkey: string;
	amount: Decimal;
};