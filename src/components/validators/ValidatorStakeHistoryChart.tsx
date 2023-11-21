/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { useMemo } from "react";
import { nFormatter, rawAmountToDecimal } from "../../utils/number";
import {
	ValidatorStakeHistory,
	ValidatorStakeHistoryResponse,
} from "../../model/validator";
import { NETWORK_CONFIG } from "../../config";

const spinnerContainer = css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export type ValidatorStakeHistoryChartProps = {
	account: string;
	stakeHistory: ValidatorStakeHistoryResponse;
	balance: any;
};

export const ValidatorStakeHistoryChart = (
	props: ValidatorStakeHistoryChartProps
) => {
	const theme = useTheme();

	const { account, stakeHistory, balance } = props;

	const loading = stakeHistory.loading || balance.loading;
	const timestamps = useMemo(() => {
		if (!stakeHistory.data) return [];
		const resp = stakeHistory.data.map(
			(x: ValidatorStakeHistory) => x.timestamp
		);
		const now = new Date();
		now.setDate(now.getDate() + 1);
		return [...resp, now.toUTCString()];
	}, [stakeHistory, balance]);
	const minAmount = useMemo(() => {
		if (!balance.data) return 0;
		if (!stakeHistory.data) return 0;
		const current = rawAmountToDecimal(balance.data.toString()).toNumber();
		return stakeHistory.data.reduce(
			(prev: number, cur: ValidatorStakeHistory) => {
				const now = rawAmountToDecimal(cur.amount.toString()).toNumber();
				return now < prev ? now : prev;
			},
			current
		);
	}, [stakeHistory, balance]);
	const maxAmount = useMemo(() => {
		if (!balance.data) return 0;
		if (!stakeHistory.data) return 0;
		const current = rawAmountToDecimal(balance.data.toString()).toNumber();
		return stakeHistory.data.reduce(
			(prev: number, cur: ValidatorStakeHistory) => {
				const now = rawAmountToDecimal(cur.amount.toString()).toNumber();
				return now > prev ? now : prev;
			},
			current
		);
	}, [stakeHistory, balance]);
	const minNominators = useMemo(() => {
		if (!stakeHistory.data) return 0;
		const resp = stakeHistory.data.reduce(
			(prev: number, cur: ValidatorStakeHistory) => {
				const now = parseInt(cur.nominators.toString());
				return now < prev ? now : prev;
			},
			100000000
		);
		return resp;
	}, [stakeHistory]);
	const maxNominators = useMemo(() => {
		if (!stakeHistory.data) return 0;
		const resp = stakeHistory.data.reduce(
			(prev: number, cur: ValidatorStakeHistory) => {
				const now = parseInt(cur.nominators.toString());
				return now > prev ? now : prev;
			},
			0
		);
		return resp;
	}, [stakeHistory]);
	const rank = useMemo(() => {
		if (!stakeHistory.data) return [];
		const resp = stakeHistory.data.map((x: ValidatorStakeHistory) =>
			parseInt(x.rank.toString())
		);
		const current = resp.length === 0 ? 0 : resp[resp.length - 1];
		return [...resp, current as number];
	}, [stakeHistory]);
	const nominators = useMemo(() => {
		if (!stakeHistory.data) return [];
		const resp = stakeHistory.data.map((x: ValidatorStakeHistory) =>
			parseInt(x.nominators.toString())
		);
		const current = resp.length === 0 ? 0 : resp[resp.length - 1];
		return [...resp, current as number];
	}, [stakeHistory]);
	const staked = useMemo(() => {
		if (!balance.data) return [];
		if (!stakeHistory.data) return [];
		const resp = stakeHistory.data.map((x: ValidatorStakeHistory) =>
			rawAmountToDecimal(x.amount.toString()).toNumber()
		);
		return [...resp, rawAmountToDecimal(balance.data).toNumber()];
	}, [stakeHistory, balance]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={400}
			series={[
				{
					name: "Rank",
					type: "area",
					data: rank,
				},
				{
					name: "Nominators",
					type: "area",
					data: nominators,
				},
				{
					name: "Staked",
					type: "area",
					data: staked,
				},
			]}
			options={{
				chart: {
					background: "#1a1a1a",
					toolbar: {
						show: true,
						offsetX: 0,
						offsetY: 0,
						autoSelected: "pan",
						tools: {
							selection: true,
							zoom: true,
							zoomin: true,
							zoomout: true,
							pan: true,
						},
						export: {
							csv: {
								filename: `staking-${account}`,
								headerCategory: "Date",
							},
							png: {
								filename: `staking-${account}`,
							},
							svg: {
								filename: `staking-${account}`,
							},
						},
					},
					zoom: {
						enabled: true,
					},
				},
				colors: [
					theme.palette.error.main,
					theme.palette.neutral.main,
					theme.palette.success.main,
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
					text: "No stake yet",
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
						formatter: (val: number) => {
							const day = new Date(val);
							const lastDay = new Date();
							lastDay.setDate(lastDay.getDate() + 1);
							if (
								day.getFullYear() === lastDay.getFullYear() &&
								day.getMonth() === lastDay.getMonth() &&
								day.getDate() === lastDay.getDate()
							)
								return "Now";
							const options: Intl.DateTimeFormatOptions = {
								day: "2-digit",
								month: "short",
								year: "2-digit",
							};
							const formattedDate = day.toLocaleDateString("en-US", options);
							return formattedDate;
						},
					},
					y: {
						formatter: (val: number, { seriesIndex }) => {
							if (seriesIndex === 2)
								return (
									NETWORK_CONFIG.currency + " " + nFormatter(val, 2).toString()
								);
							return val.toString();
						},
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
				yaxis: [
					{
						show: false,
						min: 0,
						max: 0,
					},
					{
						labels: {
							style: {
								colors: theme.palette.neutral.main,
							},
							formatter: (val: number) => parseInt(val.toString()).toString(),
						},
						title: {
							text: "Nominators",
							style: {
								color: theme.palette.neutral.main,
							},
						},
						axisTicks: {
							show: false,
						},
						axisBorder: {
							show: false,
						},
						min: minNominators,
						max: maxNominators,
					},
					{
						opposite: true,
						labels: {
							style: {
								colors: theme.palette.success.main,
							},
							formatter: (val: number) => nFormatter(val, 2).toString(),
						},
						title: {
							text: `Stake (${NETWORK_CONFIG.currency})`,
							style: {
								color: theme.palette.success.main,
							},
						},
						axisTicks: {
							show: false,
						},
						axisBorder: {
							show: false,
						},
						min: minAmount,
						max: maxAmount,
					},
				],
			}}
		/>
	);
};
