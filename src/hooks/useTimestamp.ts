import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchDictionary } from "../services/fetchService";

export const useTimestamp = (blockHeight: bigint) => {
	const [timestamp, setTimestamp] = useState<Date | undefined>();
	const [loading, setLoading] = useState(false);

	const fetchData = useCallback(async () => {
		setLoading(true);
		const res = await fetchDictionary<{ blocks: { nodes: Array<{ timestamp: Date }> } }>(
			`query ($filter: BlockFilter) {
			blocks(first: 1, offset: 0, filter: $filter) {
				nodes {
					timestamp
				}
			}
		}`,
			{
				filter: { height: { equalTo: blockHeight } },
			}
		);
        
		setTimestamp(res.blocks.nodes[0]?.timestamp);
		setLoading(false);
	}, [blockHeight]);
    
	useEffect(() => { 
		setTimestamp(undefined);
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return useMemo(() => ({ timestamp, loading }), [timestamp, loading]);
};