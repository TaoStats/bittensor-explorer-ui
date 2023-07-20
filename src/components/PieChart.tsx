/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useCallback, useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts/core";
import { PieSeriesOption } from "echarts/charts";
import { LegendComponentOption, TitleComponentOption, TooltipComponentOption } from "echarts/components";
import deepmerge from "deepmerge";

export const pieChartDefaultOptions: PieChartOptions = {
	textStyle: {
		fontFamily: "\"Open Sans\", sans-serif",
	},
	tooltip: {
		textStyle: {
			color: "inherit"
		},
		trigger: "item",
		className: "ECharts-tooltip",
		borderWidth: 0,
	},
	legend: {
		type: "scroll",
		tooltip: {
			position: (point, params, dom) => [
				point[0] - (dom as HTMLDivElement).clientWidth / 2,
				point[1] - (dom as HTMLDivElement).clientHeight - 16
			],
			show: true
		}
	},
	series: {
		name: "Data",
		type: "pie",
		label: {
			show: false,
			position: "center",
		},
	},
};

export type PieChartOptions = echarts.ComposeOption<PieSeriesOption | TitleComponentOption | LegendComponentOption | TooltipComponentOption>;

export type PieChartProps = HTMLAttributes<HTMLDivElement> & {
	options: PieChartOptions;
};

export const PieChart = (props: PieChartProps) => {
	const {options, ...divProps} = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const echartRef = useRef<echarts.ECharts>();

	const chartOptions = useMemo(() => {
		const chartOptions: PieChartOptions = {};

		for (const key in options) {
			if (Array.isArray(options[key])) {
				chartOptions[key] = (options[key]! as any[]).map(it => deepmerge(pieChartDefaultOptions[key] || {}, it));
			} else {
				chartOptions[key] = deepmerge(pieChartDefaultOptions[key] || {}, options[key]!);
			}
		}

		return chartOptions;
	}, [options]);

	const refreshChart = useCallback(() => {
		if (!echartRef.current) {
			return;
		}

		echartRef.current.resize();
		echartRef.current.setOption(chartOptions);
	}, [chartOptions]);

	useEffect(() => {
		if (containerRef.current) {
			echartRef.current = echarts.init(containerRef.current);

			echartRef.current.on("finished", () => {
				window.dispatchEvent(new CustomEvent("chart-finished", {
					detail: {
						echartRef: echartRef.current,
						containerRef: containerRef.current
					}
				}));
			});

			return () => {
				echartRef.current?.dispose();
				echartRef.current = undefined;
			};
		}
	}, []);

	useEffect(() => {
		refreshChart();
		window.addEventListener("resize", refreshChart);
		return () => window.removeEventListener("resize", refreshChart);
	}, [options]);

	return (
		<div ref={containerRef} {...divProps}></div>
	);
};
