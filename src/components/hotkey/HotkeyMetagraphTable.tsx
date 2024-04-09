/** @jsxImportSource @emotion/react */
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { NeuronMetagraph } from "../../model/subnet";
import { Link } from "../Link";
import {
	formatNumber,
	rawAmountToDecimal,
	shortenIP,
} from "../../utils/number";
import { BlockTimestamp } from "../BlockTimestamp";
import { useAppStats } from "../../contexts";

export type HotkeyMetagraphTableProps = {
	loading: boolean;
	error: any;
	data: NeuronMetagraph[];
};

const HotkeyMetagraphTableAttribute = ItemsTableAttribute<NeuronMetagraph>;

function HotkeyMetagraphTable(props: HotkeyMetagraphTableProps) {
	const { loading, error, data } = props;

	const {
		state: { chainStats },
	} = useAppStats();

	return (
		<ItemsTable
			data={data}
			loading={loading}
			error={error}
			data-test="hotkey-metagraph-table"
		>
			<HotkeyMetagraphTableAttribute
				label="NetUID"
				render={(meta) => (
					<Link href={`/subnet/${meta.netUid}`} target="_self">
						{meta.netUid}
					</Link>
				)}
			/>
			<HotkeyMetagraphTableAttribute
				label="Position"
				render={(meta) => <>{meta.rank}</>}
			/>
			<HotkeyMetagraphTableAttribute
				label="UID"
				render={(meta) => <>{meta.uid}</>}
			/>
			<HotkeyMetagraphTableAttribute
				label="Registered(UTC)"
				render={(meta) => (
					<BlockTimestamp
						blockHeight={meta.registeredAt}
						utc
						timezone={false}
						tooltip
					/>
				)}
			/>
			<HotkeyMetagraphTableAttribute
				label="Daily Rewards"
				render={(meta) => (
					<>
						{formatNumber(rawAmountToDecimal(meta.dailyReward.toString()), {
							decimalPlaces: 3,
						})}
					</>
				)}
			/>
			<HotkeyMetagraphTableAttribute
				label="Incentive"
				render={(meta) => (
					<>
						{formatNumber(meta.incentive / 65535, {
							decimalPlaces: 5,
						})}
					</>
				)}
			/>
			<HotkeyMetagraphTableAttribute
				label="Updated"
				render={(meta) => (
					<>
						{chainStats ? parseInt(chainStats.blocksFinalized.toString()) - meta.lastUpdate : 0}
					</>
				)}
			/>
			<HotkeyMetagraphTableAttribute
				label="Axon"
				render={(meta) => <>{shortenIP(meta.axonIp)}</>}
			/>
		</ItemsTable>
	);
}

export default HotkeyMetagraphTable;
