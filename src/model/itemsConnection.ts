export type ResponseItems<T = any> = {
	nodes: T[],
	pageInfo: {
		endCursor: string;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	},
	totalCount: number;
}
