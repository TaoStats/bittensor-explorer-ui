/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { useMemo } from "react";
import { MinerIPResponse } from "../../model/subnet";
import { shortenIP } from "../../utils/number";

const spinnerContainer = css`
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
`;

export type MinerIPDistributionChartProps = {
	minerIPs: MinerIPResponse;
};

export const MinerIPDistributionChart = (
	props: MinerIPDistributionChartProps
) => {
	const { minerIPs } = props;

	const loading = minerIPs.loading;
	const series = useMemo(() => {
		if (loading) return [];
		return minerIPs.data.map(({ ipAddress, minersCount }) => ({
			x: shortenIP(ipAddress),
			y: minersCount,
		}));
	}, [minerIPs]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={560}
			series={[
				{
					data: series,
				},
			]}
			type="treemap"
			options={{
				chart: {
					toolbar: {
						show: false,
					},
				},
				grid: {
					padding: {
						left: 0,
					},
					show: false,
					yaxis: {
						lines: {
							show: false,
						},
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
					show: true,
					curve: "smooth",
					lineCap: "butt",
					colors: ["black"],
					width: 2,
					dashArray: 0,
				},
				tooltip: {
					theme: "dark",
				},
				plotOptions: {
					treemap: {
						colorScale: {
							ranges: [
								{
									from: 40,
									to: 100,
									color: "#ff9900",
								},
								{
									from: 0,
									to: 40,
									color: "#14dec2",
								},
							],
						},
					},
				},
				dataLabels: {
					enabled: true,
					formatter: (_, opts) => opts.value,
				},
				legend: {
					show: false,
				},
			}}
		/>
	);
};
