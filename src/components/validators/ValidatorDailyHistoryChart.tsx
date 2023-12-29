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

export type ValidatorDailyHistoryChartProps = {
	account: string;
	stakeHistory: ValidatorStakeHistoryResponse;
	balance: any;
};

export const ValidatorDailyHistoryChart = (
	props: ValidatorDailyHistoryChartProps
) => {
	const theme = useTheme();

	const { account, stakeHistory, balance } = props;

	const loading = stakeHistory.loading || balance.loading;
	const timestamps = useMemo(() => {
		if (!stakeHistory.data) return [];
		return stakeHistory.data.map((x: ValidatorStakeHistory) => x.timestamp);
	}, [stakeHistory, balance]);
	const nominatorReturnPerK = useMemo(() => {
		if (!stakeHistory.data) return [];
		return stakeHistory.data.map((x: ValidatorStakeHistory) =>
			rawAmountToDecimal(x.nominatorReturnPerK.toString()).toNumber()
		);
	}, [stakeHistory]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={400}
			series={[
				{
					name: "Nominator",
					type: "area",
					data: nominatorReturnPerK,
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
								filename: `daily-${account}`,
								headerCategory: "Date",
							},
							png: {
								filename: `daily-${account}`,
							},
							svg: {
								filename: `daily-${account}`,
							},
						},
					},
					zoom: {
						enabled: true,
					},
				},
				colors: [theme.palette.error.main],
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
						formatter: (val: number) => {
							return (
								NETWORK_CONFIG.currency + " " + nFormatter(val, 2).toString()
							);
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
				yaxis: {
					show: timestamps.length > 0,
					opposite: true,
					labels: {
						style: {
							colors: "#a8a8a8",
						},
						formatter: (val: number) => parseInt(val.toString()).toString(),
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
