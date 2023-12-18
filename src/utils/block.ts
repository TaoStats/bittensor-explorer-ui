import { fetchDictionary } from "../services/fetchService";

export const fetchBlockTimestamp = async (blockHeight: bigint) => {
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

type BlockTimestampType = {
	[key: string]: Date;
}

export const fetchBlockTimestamps = async (blockHeights: bigint[]) => {
	const res = await fetchDictionary<{
		blocks: { nodes: Array<{ height: bigint; timestamp: Date; }> }
	}>(
		`query ($filter: BlockFilter) {
			blocks(filter: $filter) {
				nodes {
					height
					timestamp
				}
			}
		}`,
		{
			filter: { height: { in: blockHeights } },
		},
	);
	return res.blocks.nodes.reduce((timestamps: BlockTimestampType, cur) => {
		timestamps[cur.height.toString()] = cur.timestamp;
		return timestamps;
	}, {});
};