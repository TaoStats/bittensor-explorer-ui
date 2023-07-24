import { DecodedMetadata } from "./decodedMetadata";

export type RuntimeSpecResponse = {
	id: string;
	blockHeight: number;
	hex: `0x${string}`;
}

export type RuntimeSpec = {
	id: string;
	blockHeight: number;
	metadata: DecodedMetadata;
}
