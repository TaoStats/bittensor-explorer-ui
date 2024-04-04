/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { useMemo } from "react";
import { nFormatter, rawAmountToDecimal } from "../../utils/number";
import { NETWORK_CONFIG } from "../../config";
import { useHotkeyPerformance } from "../../hooks/useHotkeyPerformance";
import { NeuronPerformance } from "../../model/subnet";

const spinnerContainer = css`
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
`;

export type HotkeyPerformanceChartProps = {
	netUid: number;
	hotkey: string;
};

export const HotkeyPerformanceChart = (props: HotkeyPerformanceChartProps) => {
	const theme = useTheme();

	const { netUid, hotkey } = props;

	const perf = useHotkeyPerformance(hotkey, netUid);

	const loading = perf.loading;
	const timestamps = useMemo(() => {
		if (!perf.data) return [];
		return perf.data.map((x: NeuronPerformance) => x.timestamp);
	}, [perf]);
	const minUpdated = useMemo(() => {
		if (!perf.data) return 0;
		return perf.data.reduce((prev: number, cur: NeuronPerformance) => {
			const now = cur.updated;
			if (prev === -1) return now;
			return now < prev ? now : prev;
		}, -1);
	}, [perf]);
	const maxUpdated = useMemo(() => {
		if (!perf.data) return 0;
		return perf.data.reduce((prev: number, cur: NeuronPerformance) => {
			const now = cur.updated;
			if (prev === -1) return now;
			return now > prev ? now : prev;
		}, -1);
	}, [perf]);
	const minEmision = useMemo(() => {
		if (!perf.data) return 0;
		return perf.data.reduce((prev: number, cur: NeuronPerformance) => {
			const now = rawAmountToDecimal(cur.emission.toString()).toNumber();
			if (prev === -1) return now;
			return now < prev ? now : prev;
		}, -1);
	}, [perf]);
	const maxEmission = useMemo(() => {
		if (!perf.data) return 0;
		return perf.data.reduce((prev: number, cur: NeuronPerformance) => {
			const now = rawAmountToDecimal(cur.emission.toString()).toNumber();
			if (prev === -1) return now;
			return now > prev ? now : prev;
		}, -1);
	}, [perf]);
	const updated = useMemo(() => {
		if (!perf.data) return [];
		return perf.data.map((x: NeuronPerformance) => x.updated);
	}, [perf]);
	const emission = useMemo(() => {
		if (!perf.data) return [];
		return perf.data.map((x: NeuronPerformance) =>
			rawAmountToDecimal(x.emission.toString()).toNumber()
		);
	}, [perf]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={400}
			series={[
				{
					name: "Updated (blocks)",
					type: "line",
					data: updated,
				},
				{
					name: `Emission (${NETWORK_CONFIG.currency})`,
					type: "line",
					data: emission,
				},
			]}
			options={{
				chart: {
					toolbar: {
						show: true,
						offsetX: 0,
						offsetY: 0,
						autoSelected: "pan",
						tools: {
							download: false,
							selection: false,
							zoom: true,
							zoomin: true,
							zoomout: true,
							pan: true,
						},
					},
					zoom: {
						type: "x",
						enabled: true,
						autoScaleYaxis: true,
					},
				},
				colors: [theme.palette.success.main, theme.palette.neutral.main],
				dataLabels: {
					enabled: false,
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
					text: "No performance yet",
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
					width: 1,
					lineCap: "butt",
					dashArray: 0,
				},
				tooltip: {
					theme: "dark",
					shared: true,
					intersect: false,
					x: {
						format: "dd MMM H:mm",
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
						labels: {
							style: {
								colors: theme.palette.success.main,
							},
							formatter: (val: number) => val.toFixed(0),
						},
						title: {
							text: "Updated (blocks)",
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
						min: minUpdated,
						max: maxUpdated,
					},
					{
						opposite: true,
						labels: {
							style: {
								colors: theme.palette.neutral.main,
							},
							formatter: (val: number) => nFormatter(val, 2).toString(),
						},
						title: {
							text: `Emission (${NETWORK_CONFIG.currency})`,
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
						min: minEmision,
						max: maxEmission,
					},
				],
			}}
		/>
	);
};
