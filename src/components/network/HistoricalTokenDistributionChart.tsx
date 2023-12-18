/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { TokenStatsResponse } from "../../model/tokenStats";
import { useMemo } from "react";
import {
	formatNumber,
	nFormatter,
	rawAmountToDecimal,
} from "../../utils/number";

const spinnerContainer = css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export type HistoricalTokenDistributionChartProps = {
	tokenStats: TokenStatsResponse;
};

export const HistoricalTokenDistributionChart = (
	props: HistoricalTokenDistributionChartProps
) => {
	const theme = useTheme();

	const {
		tokenStats: { loading, data },
	} = props;

	const timestamps = useMemo(
		() => (!data ? [] : data.map(({ timestamp }) => timestamp)),
		[data]
	);
	const totalIssuance = useMemo(
		() =>
			!data
				? []
				: data.map(({ totalIssuance }) =>
					rawAmountToDecimal(totalIssuance.toString()).toNumber()
				),
		[data]
	);
	const totalStake = useMemo(
		() =>
			!data
				? []
				: data.map(({ totalStake }) =>
					rawAmountToDecimal(totalStake.toString()).toNumber()
				),
		[data]
	);
	const [min, max] = useMemo(() => {
		if (!totalIssuance || !totalStake) return [0, 0];
		const max = totalIssuance.reduce((prev: number, cur: number) => {
			return prev > cur ? prev : cur;
		}, 0);
		const min = totalStake.reduce((prev: number, cur: number) => {
			if (prev == -1) return cur;
			return prev < cur ? prev : cur;
		}, -1);
		return [min, max];
	}, [totalIssuance, totalStake]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={400}
			series={[
				{
					name: "Total Issued",
					type: "area",
					data: totalIssuance,
				},
				{
					name: "Total Staked",
					type: "area",
					data: totalStake,
				},
			]}
			options={{
				chart: {
					toolbar: {
						show: false,
					},
					zoom: {
						enabled: false,
					},
				},
				colors: [
					theme.palette.neutral.main,
					theme.palette.success.main,
					theme.palette.error.main,
				],
				dataLabels: {
					enabled: false,
				},
				fill: {
					type: "gradient",
					gradient: {
						shade: "dark",
						shadeIntensity: 1,
						inverseColors: false,
						type: "vertical",
						opacityFrom: 0.6,
						opacityTo: 0.1,
						stops: [0, 90, 100],
					},
				},
				grid: {
					show: false,
				},
				labels: timestamps,
				legend: {
					show: false,
				},
				markers: {
					size: 0,
				},
				noData: {
					text: "No accounts yet",
					align: "center",
					verticalAlign: "middle",
					offsetX: 0,
					offsetY: 0,
					style: {
						color: "#FFFFFF",
					},
				},
				responsive: [
					{
						breakpoint: 767,
						options: {
							chart: {
								height: 320,
							},
						},
					},
					{
						breakpoint: 599,
						options: {
							chart: {
								height: 270,
							},
						},
					},
				],
				stroke: {
					width: 1,
				},
				tooltip: {
					custom: ({ series, dataPointIndex }) => {
						const dateFormatOptions: Intl.DateTimeFormatOptions = {
							day: "2-digit",
							month: "short",
							year: "2-digit",
						};
						const formattedDate = new Date(
							timestamps[dataPointIndex] ?? ""
						).toLocaleDateString("en-US", dateFormatOptions);
						const totalIssued = formatNumber(series[0][dataPointIndex], {
							decimalPlaces: 2,
						});
						const totalStaked = formatNumber(series[1][dataPointIndex], {
							decimalPlaces: 2,
						});
						const stakedRate = formatNumber(
							(series[1][dataPointIndex] * 100) / series[0][dataPointIndex],
							{ decimalPlaces: 2 }
						);
						return `
								<div class="apexcharts-tooltip-title" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">${formattedDate}</div>
								<div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 2; display: flex;">
									<span class="apexcharts-tooltip-marker" style="background-color: ${theme.palette.neutral.main};"></span>
									<div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">
										<div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label">Total Issued: </span><span class="apexcharts-tooltip-text-y-value">${totalIssued}</span></div>
										<div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div>
										<div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div>
									</div>
								</div>
								<div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 3; display: flex;">
									<span class="apexcharts-tooltip-marker" style="background-color: ${theme.palette.success.main};"></span>
									<div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">
										<div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label">Total Staked: </span><span class="apexcharts-tooltip-text-y-value">${totalStaked}</span></div>
										<div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div>
										<div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div>
									</div>
								</div>
								<div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 1; display: flex;">
									<span class="apexcharts-tooltip-marker" style="background-color: ${theme.palette.error.main};"></span>
									<div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">
										<div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label">Rate: </span><span class="apexcharts-tooltip-text-y-value">${stakedRate}%</span></div>
										<div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div>
										<div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div>
									</div>
								</div>
							`;
					},
					theme: "dark",
					shared: true,
					intersect: false,
				},
				xaxis: {
					axisTicks: {
						show: false,
					},
					axisBorder: {
						show: false,
					},
					labels: {
						style: {
							fontSize: "11px",
							colors: "#7F7F7F",
						},
					},
					type: "datetime",
				},
				yaxis: {
					show: timestamps.length > 0,
					opposite: true,
					labels: {
						style: {
							colors: "#a8a8a8",
						},
						formatter: (val: number) => nFormatter(val, 1).toString(),
					},
					axisTicks: {
						show: false,
					},
					axisBorder: {
						show: false,
					},
					min,
					max,
				},
			}}
		/>
	);
};
