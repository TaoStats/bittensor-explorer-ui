import Decimal from "decimal.js";

import { RuntimeSpec } from "./runtimeSpec";

export type Transfer = {
	id: string;
	from: string;
	to: string;
	amount: Decimal;
	blockNumber: bigint;
	extrinsicId: number;

	timestamp: string;
	runtimeSpec: RuntimeSpec;
}
