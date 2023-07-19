export type ArchiveBlock = {
	id: string;
	hash: string;
	height: number;
	timestamp: string;
	parentHash: string;
	validator: string | null;
	spec: {
		specVersion: number;
	};
}
