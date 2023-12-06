import { fetchDictionary } from "../services/fetchService";

export const fetchBlocktimestamp = async (blockHeight: bigint) => {
	if(blockHeight.toString() === "0")
		return ;
	const res = await fetchDictionary<{
		blocks: { nodes: Array<{ timestamp: Date }> }
	}>(
		`query ($filter: BlockFilter) {
			blocks(first: 1, offset: 0, filter: $filter) {
				nodes {
					timestamp
				}
			}
		}`,
		{
			filter: { height: { equalTo: blockHeight } },
		},
	);
	return res.blocks.nodes[0]?.timestamp;
};