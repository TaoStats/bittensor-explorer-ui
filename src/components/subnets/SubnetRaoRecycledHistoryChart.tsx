/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { useMemo } from "react";
import {
	formatCurrency,
	rawAmountToDecimal,
	zeroPad,
} from "../../utils/number";
import { SubnetHistory, SubnetHistoryResponse } from "../../model/subnet";
import subnetNames from "../../subnets_names.json";
import { NETWORK_CONFIG } from "../../config";
const names = subnetNames as Record<string, string>;

const spinnerContainer = css`
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
`;

export type SubnetRaoRecycledHistoryChartProps = {
	subnetHistory: SubnetHistoryResponse;
};

export const SubnetRaoRecycledHistoryChart = (
	props: SubnetRaoRecycledHistoryChartProps
) => {
	const theme = useTheme();

	const { subnetHistory } = props;
	const { currency } = NETWORK_CONFIG;

	const loading = subnetHistory.loading;
	const timestamps = useMemo(() => {
		if (!subnetHistory.data) return [];
		const defaultSubnetId = subnetHistory.data[0]?.subnetId.toString();
		return subnetHistory.data
			.filter((x) => x.subnetId.toString() == defaultSubnetId)
			.map((x: SubnetHistory) => x.timestamp);
	}, [subnetHistory]);
	const series = useMemo(() => {
		if (!subnetHistory.data) return [];

		const subnets: any = {};
		for (const subnet of subnetHistory.data) {
			const { subnetId, raoRecycled } = subnet;
			const subnetIdStr = subnetId.toString();

			if (subnets[subnetIdStr]) {
				subnets[subnetIdStr].data.push(raoRecycled);
			} else {
				subnets[subnetIdStr] = {
					name: subnetIdStr,
					type: "line",
					data: [raoRecycled],
				};
			}
		}

		const result: any = [];
		for (const x in subnets) {
			subnets[x].name =
				zeroPad(subnets[x].name, 2) +
				": " +
				(names[subnets[x].name] || "Unknown");
			result.push(subnets[x]);
		}

		return result;
	}, [subnetHistory]);
	const minValue = useMemo(() => {
		return subnetHistory.data.reduce((min: number, cur: SubnetHistory) => {
			const newMin = parseInt(cur.raoRecycled.toString());
			if (min === -1) return newMin;
			return min < newMin ? min : newMin;
		}, -1);
	}, [subnetHistory]);
	const maxValue = useMemo(() => {
		return subnetHistory.data.reduce((max: number, cur: SubnetHistory) => {
			const newMax = parseInt(cur.raoRecycled.toString());
			return max > newMax ? max : newMax;
		}, 0);
	}, [subnetHistory]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={400}
			series={series}
			options={{
				chart: {
					animations: {
						enabled: false,
					},
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
								filename: "top-validators",
								headerCategory: "Date",
							},
							png: {
								filename: "top-validators",
							},
							svg: {
								filename: "top-validators",
							},
						},
					},
					zoom: {
						enabled: true,
					},
				},
				colors: [
					"#14DEC2",
					"#29D8B0",
					"#3FD19F",
					"#54CB8D",
					"#69C57B",
					"#7FBF6A",
					"#94B858",
					"#AAB247",
					"#BFAC35",
					"#D4A623",
					"#EA9F12",
					"#FF9900",
				],
				dataLabels: {
					enabled: false,
				},
				grid: {
					show: false,
				},
				labels: timestamps,
				legend: {
					show: true,
					showForSingleSeries: true,
					position: "top",
					horizontalAlign: "right",
					labels: {
						colors: "#d9d9d9",
					},
				},
				markers: {
					size: 0,
				},
				noData: {
					text: "No validators yet",
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
					curve: "smooth",
					width: 2,
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
						formatter: (val: number) =>
							formatCurrency(rawAmountToDecimal(val), "USD", {
								decimalPlaces: 2,
							}) + ` ${currency}`,
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
					decimalsInFloat: 3,
					labels: {
						style: {
							colors: theme.palette.neutral.main,
						},
						formatter: (val: number) =>
							formatCurrency(rawAmountToDecimal(val), "USD", {
								decimalPlaces: 2,
							}) + ` ${currency}`,
					},
					title: {
						text: "TAO RECYCLED",
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
					min: minValue,
					max: maxValue,
				},
			}}
		/>
	);
};
