/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { AccountStats, AccountStatsResponse } from "../../model/accountStats";
import { useMemo } from "react";
import { formatNumber, nFormatter } from "../../utils/number";

const spinnerContainer = css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export type AccountStatChartProps = {
	accountStats: AccountStatsResponse;
};

export const AccountStatChart = (props: AccountStatChartProps) => {
	const theme = useTheme();

	const {
		accountStats: { loading, data },
	} = props;

	const totalAccount = useMemo(() => {
		if (!data) return 0;
		const resp = (data as any).reduce(
			(prev: number, cur: AccountStats) => parseInt(cur.total.toString()),
			0
		);
		return resp;
	}, [data]);
	const timestamps = useMemo(
		() => (!data ? [] : data.map(({ timestamp }) => timestamp)),
		[data]
	);
	const totalAccounts = useMemo(
		() => (!data ? [] : data.map(({ total }) => Number(total))),
		[data]
	);
	const holders = useMemo(
		() => (!data ? [] : data.map(({ holders }) => Number(holders))),
		[data]
	);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={400}
			series={[
				{
					name: "Total Accounts",
					type: "area",
					data: totalAccounts,
				},
				{
					name: "Non-zero Accounts",
					type: "area",
					data: holders,
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
					theme: "dark",
					shared: true,
					intersect: false,
					x: {
						format: "dd MMM yy",
					},
					y: {
						formatter: (val: number) => formatNumber(val),
					},
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
					min: 0,
					max: totalAccount,
				},
			}}
		/>
	);
};
