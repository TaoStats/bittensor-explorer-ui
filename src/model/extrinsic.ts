import { RuntimeSpec } from "./runtimeSpec";

export type Extrinsic = {
	id: string;
	module: string;
	call: string;
	blockHeight: bigint;
	success: boolean;
	isSigned: boolean;
	extrinsicHash: string;
	args: string[];
	nonce: number;
	signer: string;
	version: number;
	tip: bigint;
	blockId: string;
	timestamp?: Date;
	specVersion?: number;
	runtimeSpec?: RuntimeSpec;
}
