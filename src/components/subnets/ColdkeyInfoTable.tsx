/** @jsxImportSource @emotion/react */
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Resource } from "../../model/resource";
import { NeuronMetagraph } from "../../model/subnet";
import { ItemsResponse } from "../../model/itemsResponse";
import { useMemo } from "react";
import { useTaoPrice } from "../../hooks/useTaoPrice";
import { formatNumber, rawAmountToDecimal } from "../../utils/number";
import Spinner from "../Spinner";
import Decimal from "decimal.js";
import { NETWORK_CONFIG } from "../../config";

export type ColdkeyInfoTableProps = {
	info: Resource<ItemsResponse<NeuronMetagraph>>;
};

const ColdkeyInfoTableAttribute = InfoTableAttribute<any>;

export const ColdkeyInfoTable = (props: ColdkeyInfoTableProps) => {
	const { info } = props;

	const taoPrice = useTaoPrice();

	const [totalKeys, totalStake, totalDailyReward] = useMemo(() => {
		const hotkeys: string[] = [];
		let totalStake: Decimal = new Decimal(0);
		let totalDailyReward: Decimal = new Decimal(0);

		if (info.loading || !info.data)
			return [hotkeys.length, totalStake, totalDailyReward];

		info.data.data.forEach((metagraph) => {
			const hotkey = metagraph.hotkey;
			if (!hotkeys.includes(hotkey)) {
				hotkeys.push(hotkey);
			}
			totalStake = totalStake.add(
				rawAmountToDecimal(metagraph.stake.toString())
			);
			totalDailyReward = totalDailyReward.add(
				rawAmountToDecimal(metagraph.dailyReward.toString())
			);
		});

		return [hotkeys.length, totalStake, totalDailyReward];
	}, [info]);

	return (
		<InfoTable
			data={info}
			loading={info.loading}
			notFound={info.notFound}
			notFoundMessage="No coldkey found"
			error={info.error}
		>
			<ColdkeyInfoTableAttribute label="Total keys" render={() => totalKeys} />
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
