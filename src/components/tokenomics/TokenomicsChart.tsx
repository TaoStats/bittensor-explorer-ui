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
	const strUnissuedPercent = formatNumber(unissuedPercent, {decimalPlaces: 2 });

	const stakedPercent = stakedCirculatingSupply.mul(100).div(circulatingSupply);
	const strStakedPercent = formatNumber(stakedPercent, { decimalPlaces: 2 });
	
	const freePercent = freeCirculatingSupply.mul(100).div(circulatingSupply);
	const strFreePercent = formatNumber(freePercent, { decimalPlaces: 2 });
	
	const strCirculatingSupply = nFormatter(circulatingSupply.toNumber(), 2);
	const strTotalSupply = nFormatter(totalSupply.toNumber(), 2);

	const strStaked = `Circulating Delegated/Staked (${strStakedPercent}% of ${strCirculatingSupply})`;
	const strFree = `Circulating Free (${strFreePercent}% of ${strCirculatingSupply})`;
	const strUnissued = `Unissued (${strUnissuedPercent}% of ${strTotalSupply})`;

	return (
		<div>
			<DonutChart
				height={560}
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
					stakedCirculatingSupply.toDecimalPlaces(0).toNumber(),
					freeCirculatingSupply.toDecimalPlaces(0).toNumber(),
					unissued.toDecimalPlaces(0).toNumber(),
				]}
			/>
		</div>
	);
};
