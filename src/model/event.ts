export type Event = {
	id: string;
	module: string;
	event: string;
	blockHeight: bigint;
	data: string[];
	extrinsicId: string | null;
}
