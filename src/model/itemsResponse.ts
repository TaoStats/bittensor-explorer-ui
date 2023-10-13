export type ItemsResponse<T = any> = {
	data: T[];
	pagination: {
		endCursor: string;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		limit: number;
		totalCount?: number;
	}
}
