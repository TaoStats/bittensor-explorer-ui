export type ResponseItems<T = any> = {
	nodes: T[],
	pageInfo: {
		startCursor: string;
		endCursor: string;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	},
	totalCount: number;
}
