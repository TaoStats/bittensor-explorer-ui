export interface EventResponse {
	id: string;
	module: string;
	event: string;
	blockHeight: bigint;
	data: string;
	extrinsicId: number;
}

export interface Event extends Omit<Omit<EventResponse, "data">, "extrinsicId"> {
	data: string[];
	extrinsicId: string;
}
