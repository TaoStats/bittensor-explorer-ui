export type Block = {
	id: string;
	timestamp: string;
	specVersion: number;
	height: bigint;
	hash: string;
	parentHash: string;
	stateRoot: string;
	extrinsicRoot: string;
}
