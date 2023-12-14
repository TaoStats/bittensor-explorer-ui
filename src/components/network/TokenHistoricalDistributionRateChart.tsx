/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { TokenStats, TokenStatsResponse } from "../../model/tokenStats";
import { useMemo } from "react";
import { formatNumber, nFormatter, rawAmountToDecimal } from "../../utils/number";

const spinnerContainer = css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export type TokenHistoricalDistributionChartProps = {
	tokenStats: TokenStatsResponse;
};

export const TokenHistoricalDistributionRateChart = (
	props: TokenHistoricalDistributionChartProps
) => {
	const theme = useTheme();

	const { tokenStats } = props;

	const loading = tokenStats.loading;
	const timestamps = useMemo(() => {
		if (!tokenStats.data) return [];
		const resp = (tokenStats.data as any).reduce(
			(prev: string[], cur: TokenStats) => {
				prev.push(cur.timestamp);
				return prev;
			},
			[]
		);
		return resp;
	}, [tokenStats]);
	const stakingRate = useMemo(() => {
		if (!tokenStats.data) return [];
		const resp = (tokenStats.data as any).reduce(
			(prev: number[], cur: TokenStats) => {
				prev.push(
					parseFloat((cur.totalStake / cur.totalIssuance).toString()) * 100
				);
				return prev;
			},
			[]
		);
		return resp;
	}, [tokenStats]);
	const [minRate, maxRate] = useMemo(() => {
		if(!stakingRate) return [0, 0];
		const resp = stakingRate.reduce(
			(prev: [number, number], cur: number) => {
				const min = prev[0] < cur ? prev[0] : cur;
				const max = prev[1] > cur ? prev[1] : cur;
				return [min, max];
			},
			[100, 0]
		);
		return resp;
	}, [stakingRate]);
	const totalIssuance = useMemo(() => {
		if (!tokenStats.data) return [];
		const resp = (tokenStats.data as any).reduce(
			(prev: number[], cur: TokenStats) => {
				prev.push(rawAmountToDecimal(cur.totalIssuance.toString()).toNumber());
				return prev;
			},
			[]
		);
		return resp;
	}, [tokenStats]);
	const totalStake = useMemo(() => {
		if (!tokenStats.data) return [];
		const resp = (tokenStats.data as any).reduce(
			(prev: number[], cur: TokenStats) => {
				prev.push(rawAmountToDecimal(cur.totalStake.toString()).toNumber());
				return prev;
			},
			[]
		);
		return resp;
	}, [tokenStats]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={400}
			series={[
				{
					name: "Staked Rate",
					type: "area",
					data: stakingRate,
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
					custom: ({ series, dataPointIndex}) => {
						const dateFormatOptions: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "2-digit" };
						const formattedDate = new Date(timestamps[dataPointIndex]).toLocaleDateString("en-US", dateFormatOptions);
						const stakedRate = formatNumber(series[0][dataPointIndex], {decimalPlaces: 2});
						const totalIssued = formatNumber(totalIssuance[dataPointIndex], {decimalPlaces: 2});
						const totalStaked = formatNumber(totalStake[dataPointIndex], {decimalPlaces: 2});
						return (
							`
								<div class="apexcharts-tooltip-title" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">${formattedDate}</div>
								<div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 1; display: flex;">
									<span class="apexcharts-tooltip-marker" style="background-color: ${theme.palette.neutral.main};"></span>
									<div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">
										<div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label">Rate: </span><span class="apexcharts-tooltip-text-y-value">${stakedRate}%</span></div>
										<div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div>
										<div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div>
									</div>
								</div>
								<div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 2; display: flex;">
									<span class="apexcharts-tooltip-marker" style="background-color: ${theme.palette.success.main};"></span>
									<div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">
										<div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label">Total Issued: </span><span class="apexcharts-tooltip-text-y-value">${totalIssued}</span></div>
										<div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div>
										<div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div>
									</div>
								</div>
								<div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 3; display: flex;">
									<span class="apexcharts-tooltip-marker" style="background-color: ${theme.palette.error.main};"></span>
									<div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">
										<div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label">Total Staked: </span><span class="apexcharts-tooltip-text-y-value">${totalStaked}</span></div>
										<div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div>
										<div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div>
									</div>
								</div>
							`
						);
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
						formatter: (val: number) => nFormatter(val, 0).toString(),
					},
					axisTicks: {
						show: false,
					},
					axisBorder: {
						show: false,
					},
					min: minRate,
					max: maxRate,
				},
			}}
		/>
	);
};
