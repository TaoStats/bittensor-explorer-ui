/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { useAccountStats } from "../../hooks/useAccountStats";
import { AccountStats } from "../../model/accountStats";
import { useMemo } from "react";
import { formatNumber } from "../../utils/number";

const spinnerContainer = css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const AccountStatChart = () => {
	const theme = useTheme();
	const accountStats = useAccountStats();

	const loading = accountStats.loading;
	const timestamps = useMemo(() => {
		if (!accountStats.data) return [];
		const resp = (accountStats.data as any).reduce(
			(prev: string[], cur: AccountStats) => {
				prev.push(cur.timestamp);
				return prev;
			},
			[]
		);
		return resp;
	}, [accountStats]);
	const totalAccounts = useMemo(() => {
		if (!accountStats.data) return [];
		const resp = (accountStats.data as any).reduce(
			(prev: bigint[], cur: AccountStats) => {
				prev.push(cur.total);
				return prev;
			},
			[]
		);
		return resp;
	}, [accountStats]);
	// const activeAccounts = useMemo(() => {
	// 	if (!accountStats.data) return [];
	// 	const resp = (accountStats.data as any).reduce(
	// 		(prev: bigint[], cur: AccountStats) => {
	// 			prev.push(cur.active);
	// 			return prev;
	// 		},
	// 		[]
	// 	);
	// 	return resp;
	// }, [accountStats]);
	const holders = useMemo(() => {
		if (!accountStats.data) return [];
		const resp = (accountStats.data as any).reduce(
			(prev: bigint[], cur: AccountStats) => {
				prev.push(cur.holders);
				return prev;
			},
			[]
		);
		return resp;
	}, [accountStats]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={400}
			series={[
				{
					name: "All Accounts",
					type: "area",
					data: totalAccounts,
				},
				// {
				// 	name: "Active Accounts",
				// 	type: "area",
				// 	data: activeAccounts,
				// },
				{
					name: "Active Accounts > 0𝞃",
					type: "area",
					data: holders,
				},
			]}
			options={{
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
					text: "Loading ...",
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
						formatter: (val: number) => formatNumber(val, { decimalPlaces: 2 }),
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
					opposite: true,
					labels: {
						style: {
							colors: "#a8a8a8",
						},
						formatter: (val: number) => formatNumber(val, { decimalPlaces: 2 }),
					},
					axisTicks: {
						show: false,
					},
					axisBorder: {
						show: false,
					},
				},
			}}
		/>
	);
};
