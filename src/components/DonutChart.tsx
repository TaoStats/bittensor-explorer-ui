import Chart from "react-apexcharts";
import { HTMLAttributes } from "react";
import { ApexOptions } from "apexcharts";
import { formatNumber } from "../utils/number";
import { useTheme } from "@emotion/react";

export type DonutChartProps = HTMLAttributes<HTMLDivElement> & {
	series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
	options?: ApexOptions;
	height?: number;
};
export const DonutChart = (props: DonutChartProps) => {
	const { series, height, options } = props;

	const theme = useTheme();

	return (
		<Chart
			options={{
				colors: [
					theme.palette.success.main,
					theme.palette.neutral.main,
					"#848484",
				],
				dataLabels: {
					enabled: false,
				},
				tooltip: {
					y: {
						formatter: (val: number) => formatNumber(val, { decimalPlaces: 2 }),
					},
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
					horizontalAlign: "left",
					floating: false,
					fontSize: "13px",
					labels: {
						colors: undefined,
						useSeriesColors: true,
					},
				},
				...options,
			}}
			series={series}
			type="donut"
			height={height ?? 400}
		/>
	);
};
