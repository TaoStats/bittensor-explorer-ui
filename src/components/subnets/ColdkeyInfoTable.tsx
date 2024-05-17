/** @jsxImportSource @emotion/react */
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { ColdkeyInfo } from "../../model/subnet";
import { useMemo } from "react";
import { useTaoPrice } from "../../hooks/useTaoPrice";
import { formatNumber, rawAmountToDecimal } from "../../utils/number";
import Spinner from "../Spinner";
import Decimal from "decimal.js";
import { NETWORK_CONFIG } from "../../config";
import { DataError } from "../../utils/error";

export type ColdkeyInfoTableProps = {
	info: {
		loading: boolean;
		data: ColdkeyInfo[];
		error?: DataError;
	};
};

const ColdkeyInfoTableAttribute = InfoTableAttribute<any>;

export const ColdkeyInfoTable = (props: ColdkeyInfoTableProps) => {
	const { info } = props;

	const taoPrice = useTaoPrice();

	const [totalKeys, totalNeurons, totalStake, totalDailyReward] =
		useMemo(() => {
			const hotkeys: Set<string> = new Set();
			let totalStake: Decimal = new Decimal(0);
			let totalDailyReward: Decimal = new Decimal(0);

			if (info.loading || !info.data)
				return [hotkeys.size, 0, totalStake, totalDailyReward];

			info.data.forEach(({hotkey, stake, dailyReward}) => {
				totalDailyReward = totalDailyReward.add(
					rawAmountToDecimal(dailyReward.toString())
				);
				if (hotkeys.has(hotkey)) return;
				hotkeys.add(hotkey);
				totalStake = totalStake.add(
					rawAmountToDecimal(stake.toString())
				);
			});


			return [hotkeys.size, info.data.length, totalStake, totalDailyReward];
		}, [info]);

	return (
		<InfoTable
			data={info}
			loading={info.loading}
			notFound={info.error !== null}
			notFoundMessage="Invalid coldkey."
			error={info.error}
		>
			<ColdkeyInfoTableAttribute
				label="Total Neurons"
				render={() => totalNeurons}
			/>
			<ColdkeyInfoTableAttribute
				label="Total Hotkeys"
				render={() => totalKeys}
			/>
			<ColdkeyInfoTableAttribute
				label="Daily Rewards"
				render={() =>
					taoPrice.loading ? (
						<Spinner small />
					) : (
						<span>
							{NETWORK_CONFIG.currency}
							{formatNumber(totalDailyReward, {
								decimalPlaces: 3,
							})}
							&nbsp; ($
							{formatNumber(totalDailyReward.mul(taoPrice.data || 0), {
								decimalPlaces: 2,
							})}
							)
						</span>
					)
				}
			/>
			<ColdkeyInfoTableAttribute
				label="Total Stake"
				render={() =>
					taoPrice.loading ? (
						<Spinner small />
					) : (
						<span>
							{NETWORK_CONFIG.currency}
							{formatNumber(totalStake, {
								decimalPlaces: 2,
							})}
							&nbsp; ($
							{formatNumber(totalStake.mul(taoPrice.data || 0), {
								decimalPlaces: 2,
							})}
							)
						</span>
					)
				}
			/>
		</InfoTable>
	);
};
