import { Time, TimeProps } from "./Time";
import Spinner from "../components/Spinner";
import useSWRImmutable from "swr/immutable";
import { fetchBlockTimestamp } from "../utils/block";

interface BlockTimestampProps extends Omit<TimeProps, "time"> {
	blockHeight: bigint;
}
export const BlockTimestamp = ({
	blockHeight,
	...props
}: BlockTimestampProps) => {
	const { data, isLoading, error } = useSWRImmutable(
		blockHeight.toString(),
		fetchBlockTimestamp
	);

	return isLoading ? (
		<Spinner small />
	) : error || !data ? (
		<></>
	) : (
		<Time time={data} {...props} />
	);
};
