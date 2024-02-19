export type TransferResponse = {
	id: string;
	from: string;
	to: string;
	amount: bigint;
	blockNumber: bigint;
	extrinsicId: number;
};

export interface Transfer extends Omit<TransferResponse, "extrinsicId"> {
	extrinsicId: string;
}
