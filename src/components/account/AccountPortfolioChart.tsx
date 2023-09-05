/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import { formatCurrency, rawAmountToDecimal } from "../../utils/number";

import { AccountBalance } from "../../model/balance";
import Decimal from "decimal.js";

const chartContainer = css``;

export type AccountPortfolioChartProps = HTMLAttributes<HTMLDivElement> & {
	balance: AccountBalance | undefined;
	taoPrice: Decimal | undefined;
};

export const AccountPortfolioChart = (props: AccountPortfolioChartProps) => {
	const { balance } = props;
	
	const theme = useTheme();

	const free = rawAmountToDecimal(balance?.free.toString());
	const delegated = rawAmountToDecimal(balance?.staked.toString());
	const total = rawAmountToDecimal(balance?.total.toString());

	const strFree = formatCurrency(free, "USD", { decimalPlaces: 2 });
	const strDelegated = formatCurrency(delegated, "USD", { decimalPlaces: 2 });
	
	return (
		total.isZero() ? <></>: 
			<div css={chartContainer}>
				<Chart
					options={{
						labels: [
							`Delegated: ${strDelegated} 𝞃 (${delegated.div(total).mul(100).toFixed(2)}%)`,
							`Free: ${strFree} 𝞃 (${free.div(total).mul(100).toFixed(2)}%)`
						],
						colors: [ theme.palette.success.main, theme.palette.neutral.main ],
						dataLabels: {
							enabled: false,
						},
						stroke: {
							show: true,
							curve: "smooth",
							lineCap: "butt",
							colors: [theme.palette.primary.dark],
							width: 6,
							dashArray: 0,
						},
						responsive: [
							{
								breakpoint: 767,
								options: {
									chart: {
										height: 320,
									},
									stroke: {
										width: 4,
									},
								},
							},
							{
								breakpoint: 599,
								options: {
									chart: {
										height: 270,
									},
									stroke: {
										width: 2,
									},
								},
							},
						],
						legend: {
							show: true,
							position: "bottom",
							horizontalAlign: "center",
							floating: false,
							fontSize: "13px",
							labels: {
								colors: undefined,
								useSeriesColors: true,
							},
						},
					}}
					series={[
						parseFloat(delegated.toFixed(2)),
						parseFloat(free.toFixed(2)),
					]}
					type='donut'
					height={400}
				/>
			</div>
	);
};
	