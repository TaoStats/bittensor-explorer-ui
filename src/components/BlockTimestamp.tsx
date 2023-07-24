import { useTimestamp } from "../hooks/useTimestamp";
import { Time, TimeProps } from "./Time";

interface BlockTimestampProps extends Omit<TimeProps, "time"> {
	blockHeight: bigint;
}
export const BlockTimestamp = ({ blockHeight, ...props }: BlockTimestampProps) => {
	const { timestamp, loading } = useTimestamp(blockHeight);
	
	return !loading && timestamp ? <Time time={timestamp} {...props} /> : <></>;
};
