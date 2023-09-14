/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { useAccountStats } from "../../hooks/useAccountStats";
import { AccountStats } from "../../model/accountStats";
import { useMemo } from "react";

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
	const activeAccounts = useMemo(() => {
		if (!accountStats.data) return [];
		const resp = (accountStats.data as any).reduce(
			(prev: bigint[], cur: AccountStats) => {
				prev.push(cur.active);
				return prev;
			},
			[]
		);
		return resp;
	}, [accountStats]);
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
					name: "Total accounts",
					type: "area",
					data: totalAccounts,
				},
				{
					name: "Active accounts",
					type: "area",
					data: activeAccounts,
				},
				{
					name: "Holders",
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
				stroke: {
					show: true,
					curve: "smooth",
					lineCap: "butt",
					colors: [
						theme.palette.neutral.main,
						theme.palette.success.main,
						theme.palette.error.main,
					],
					width: 1,
					dashArray: 0,
				},
				plotOptions: {
					bar: {
						columnWidth: 10,
					},
				},
				fill: {
					type: "gradient",
					gradient: {
						inverseColors: false,
						shade: "light",
						type: "vertical",
						opacityFrom: 0.85,
						opacityTo: 0,
					},
				},
				labels: timestamps,
				markers: {
					size: 0,
				},
				xaxis: {
					type: "datetime",
				},
				yaxis: {
					min: 0,
				},
				tooltip: {
					shared: true,
					intersect: false,
					theme: "dark",
				},
			}}
		/>
	);
};
