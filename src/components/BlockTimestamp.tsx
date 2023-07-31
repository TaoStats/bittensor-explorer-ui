import { Time, TimeProps } from "./Time";
import Spinner from "../components/Spinner";
import useSWRImmutable  from "swr/immutable";
import { fetchDictionary } from "../services/fetchService";

interface BlockTimestampProps extends Omit<TimeProps, "time"> {
	blockHeight: bigint
}
export const BlockTimestamp = ({
	blockHeight,
	...props
}: BlockTimestampProps) => {
	const fetchBlocktimestamp = async (blockHeight: bigint) => {
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
	const { data, isLoading, error } = useSWRImmutable (blockHeight.toString(), fetchBlocktimestamp);

	return isLoading ? (
		<Spinner />
	) : error || !data ? (
		<></>
	) : (
		<Time time={data} {...props} />
	);
};
