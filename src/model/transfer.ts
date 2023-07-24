import Decimal from "decimal.js";

import { RuntimeSpec } from "./runtimeSpec";

export type TransferResponse = {
	id: string;
	from: string;
	to: string;
	amount: bigint;
	blockNumber: bigint;
	extrinsicId: number;
}

export type Transfer = TransferResponse & {
	amount: Decimal;
	timestamp: Date;
	runtimeSpec: RuntimeSpec;
}
