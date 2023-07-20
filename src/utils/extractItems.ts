import { ResponseItems } from "../model/itemsConnection";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginationOptions } from "../model/paginationOptions";

export function extractItems<R = any, T = any, A extends any[] = any[]>(
	resp: ResponseItems<T>,
	pagination: PaginationOptions,
	transformNode: (node: T, ...a: A) => R,
	...additionalArgs: A
): ItemsResponse<R> {
	return {
		data: resp.nodes.map((node) => transformNode(node, ...additionalArgs)),
		pagination: {
			...pagination,
			hasNextPage: resp.pageInfo.hasNextPage,
			totalCount: resp.totalCount
		}
	};
}
