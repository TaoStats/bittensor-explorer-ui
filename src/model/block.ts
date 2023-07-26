import { RuntimeSpec } from "./runtimeSpec";

export type Block = {
	id: string;
	timestamp: string;
	specVersion: number;
	height: bigint;
	hash: string;
	parentHash: string;
	stateRoot: string;
	extrinsicRoot: string;
	validator: string | null;
	runtimeSpec: RuntimeSpec;
}
