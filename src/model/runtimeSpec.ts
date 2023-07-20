import { DecodedMetadata } from "./decodedMetadata";

export type RuntimeSpecResponse = {
	id: string;
	blockHeight: number;
	metadata: string;
}

export type RuntimeSpec = {
	id: string;
	blockHeight: number;
	metadata: DecodedMetadata;
}
