/** @jsxImportSource @emotion/react */
import { useTheme } from "@emotion/react";
import { HTMLAttributes } from "react";
import Chart from "react-apexcharts";

export type HalveningChartProps = HTMLAttributes<HTMLDivElement> & {
	halveningData: any;
};

export const HalveningChart = (props: HalveningChartProps) => {
	const { halveningData } = props;

	const theme = useTheme();

	const taoIssued = [
		{
			x: "01/09/2021",
			y: 0,
		},
		{
			x: "05/12/2021",
			y: 546113,
		},
		{
			x: "11/21/2021",
			y: 546113,
		},
		{
			x: "05/08/2024",
			y: 6727871,
		},
	];

	const events = [
		{
			x: new Date("09 Jan 2021").getTime(),
			borderColor: "#fff",
			label: {
				style: {
					color: "#000",
				},
				text: "Kusangi Network",
			},
		},
		{
			x: new Date("12 Mar 2021").getTime(),
			borderColor: "#fff",
			label: {
				style: {
					color: "#000",
				},
				text: "Kusangi Network Halted",
			},
		},
		{
			x: new Date("21 Nov 2021").getTime(),
			borderColor: "#fff",
			label: {
				style: {
					color: "#000",
				},
				text: "Nakamoto Network",
			},
		},
		{
			x: new Date("20 Mar 2023").getTime(),
			borderColor: "#fff",
			label: {
				style: {
					color: "#000",
				},
				text: "Finney Network",
			},
		},
	];
	for (let i = 1; i <= 6; i++) {
		taoIssued.push({
			x: new Date(halveningData[i].time * 1000).toDateString(),
			y: parseInt(halveningData[i].total.replace(/,/g, "")),
		});
		events.push({
			x: new Date(halveningData[i].time * 1000).getTime(),
			borderColor: "#fff",
			label: {
				style: {
					color: "#000",
				},
				text:
					(i == 1 ? "1st" : i == 2 ? "2nd" : i == 3 ? "3rd" : `${i}th`) +
					" Halvening",
			},
		});
	}

	return (
		<div>
			<Chart
				height={300}
				series={[
					{
						name: "TAO",
						type: "area",
						data: taoIssued,
					},
				]}
				options={{
					annotations: {
						xaxis: events,
					},
					chart: {
						background: theme.palette.primary.dark,
						toolbar: {
							show: true,
							offsetX: 0,
							offsetY: 0,
							tools: {
								download: true,
								selection: false,
								zoom: true,
								zoomin: true,
								zoomout: true,
								pan: true,
							},
							autoSelected: "pan",
							export: {
								csv: {
									filename: "halvening-chart",
									headerCategory: "Date",
								},
								png: {
									filename: "halvening-chart",
								},
								svg: {
									filename: "halvening-chart",
								},
							},
						},
						zoom: {
							enabled: false,
						},
					},
					colors: [theme.palette.neutral.main],
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
						padding: {
							left: 0,
						},
						show: true,
						borderColor: "rgba(255, 255, 255, 0.04)",
						strokeDashArray: 4,
					},
					markers: {
						size: 3,
						colors: ["#000"],
						strokeColors: [theme.palette.neutral.main],
						strokeWidth: 1,
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
						curve: "straight",
						width: 1,
						lineCap: "butt",
						dashArray: 0,
					},
					tooltip: {
						enabled: false,
					},
					xaxis: {
						type: "datetime",
						labels: {
							style: {
								colors: "#a8a8a8",
							},
						},
					},
					yaxis: [
						{
							opposite: true,
							max: 21000000,
							labels: {
								style: {
									colors: theme.palette.secondary.dark,
								},
							},
						},
					],
				}}
			/>
		</div>
	);
};
