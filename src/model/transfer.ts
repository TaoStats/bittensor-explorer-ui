export type Transfer = {
	id: string;
	from: string;
	to: string;
	amount: bigint;
	blockNumber: bigint;
	extrinsicId: number;
}