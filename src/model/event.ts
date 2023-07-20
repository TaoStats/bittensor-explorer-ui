import { RuntimeSpec } from "./runtimeSpec";

export type Event = {
	id: string;
	module: string;
	event: string;
	blockHeight: bigint;
	data: string[];

	timestamp: string;
	specVersion: number;
	extrinsicId: string | null;
	runtimeSpec: RuntimeSpec;
}
