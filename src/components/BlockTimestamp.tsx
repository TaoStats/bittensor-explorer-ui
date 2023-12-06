/** @jsxImportSource @emotion/react */
import { Time, TimeProps } from "./Time";
import Spinner from "../components/Spinner";
import useSWRImmutable  from "swr/immutable";
import ErrorIcon from "@mui/icons-material/Warning";
import { css } from "@emotion/react";
import { fetchBlocktimestamp } from "../utils/block";

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
