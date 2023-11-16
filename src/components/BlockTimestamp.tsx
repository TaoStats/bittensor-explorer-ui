/** @jsxImportSource @emotion/react */
import { Time, TimeProps } from "./Time";
import Spinner from "../components/Spinner";
import useSWRImmutable  from "swr/immutable";
import { fetchDictionary } from "../services/fetchService";
import ErrorIcon from "@mui/icons-material/Warning";
import { css } from "@emotion/react";

const errorIconStyle = css`
  margin-left: 8px;
  position: relative;
  top: 1px;
  color: #ef5350;
`;

interface BlockTimestampProps extends Omit<TimeProps, "time"> {
	blockHeight: bigint
}
export const BlockTimestamp = ({
	blockHeight,
	...props
}: BlockTimestampProps) => {
	const fetchBlocktimestamp = async (blockHeight: bigint) => {
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
	const { data, isLoading, error } = useSWRImmutable (blockHeight.toString(), fetchBlocktimestamp);

	return isLoading ? (
		<Spinner small />
	) : error ? (
		<ErrorIcon css={errorIconStyle} />
	) : !data ? (
		<>Nakamoto</>
	) : (
		<Time time={data} {...props} />
	);
};
