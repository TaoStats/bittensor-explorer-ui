import { TokenStats, TokenStatsPaginatedResponse } from "../model/tokenStats";
import { ResponseItems } from "../model/itemsConnection";
import { fetchHistorical } from "./fetchService";

export async function getTokenStats(
	after?: string,
	limit = 100
): Promise<TokenStatsPaginatedResponse> {
	const response = await fetchHistorical<{
		tokenStats: ResponseItems<TokenStats>;
	}>(
		`query($after: Cursor, $first: Int!) {
			tokenStats(after: $after, first: $first, orderBy: HEIGHT_ASC) {
				pageInfo {
					hasNextPage
					endCursor
				}
				nodes {
					totalStake
					totalIssuance
					id
					timestamp
				}
			  }
		}`,
		{
			first: limit,
			after,
		}
	);

	return {
		hasNextPage: response.tokenStats?.pageInfo.hasNextPage,
		endCursor: response.tokenStats?.pageInfo.endCursor,
		data: response.tokenStats?.nodes,
	};
}
