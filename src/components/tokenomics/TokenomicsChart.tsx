/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";

import { formatNumber, nFormatter } from "../../utils/number";

import Decimal from "decimal.js";
import { DonutChart } from "../DonutChart";

export type TokenomicsChartProps = HTMLAttributes<HTMLDivElement> & {
	totalSupply: Decimal;
	circulatingSupply: Decimal;
	unissued: Decimal;
	stakedCirculatingSupply: Decimal;
	freeCirculatingSupply: Decimal;
};

export const TokenomicsChart = (props: TokenomicsChartProps) => {
	const {
		totalSupply,
		circulatingSupply,
		unissued,
		stakedCirculatingSupply,
		freeCirculatingSupply,
	} = props;

	const unissuedPercent = unissued.mul(100).div(totalSupply);
	const stakedPercent = stakedCirculatingSupply.mul(100).div(circulatingSupply);
	const freePercent = freeCirculatingSupply.mul(100).div(circulatingSupply);

	const strStaked = `Circulating Delegated/Staked (${formatNumber(
		stakedPercent,
		{ decimalPlaces: 2 }
	)}% of ${nFormatter(circulatingSupply.toNumber(), 2)})`;
	const strFree = `Circulating Free (${formatNumber(freePercent, {
		decimalPlaces: 2,
	})}% of ${nFormatter(circulatingSupply.toNumber(), 2)})`;
	const strUnissued = `Unissued (${formatNumber(unissuedPercent, {
		decimalPlaces: 2,
	})}% of ${nFormatter(totalSupply.toNumber(), 2)})`;

	return (
		<div>
			<DonutChart
				options={{
					labels: [strStaked, strFree, strUnissued],
					legend: {
						position: "right",
						labels: {
							useSeriesColors: true,
						},
					},
				}}
				series={[
					parseFloat(stakedCirculatingSupply.toFixed(0)),
					parseFloat(freeCirculatingSupply.toFixed(0)),
					parseFloat(unissued.toFixed(0)),
				]}
			/>
		</div>
	);
};
