/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { useMemo } from "react";
import { nFormatter, rawAmountToDecimal } from "../../utils/number";
import {
	AccountDelegateHistory,
	AccountDelegateHistoryResponse,
} from "../../model/accountHistory";
import { NETWORK_CONFIG } from "../../config";
import { useVerifiedDelegates } from "../../hooks/useVerifiedDelegates";
import { DelegateBalance } from "../../model/delegate";
import { Resource } from "../../model/resource";

const spinnerContainer = css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export type AccounDelegateHistoryChartProps = {
	account: string;
	delegateHistory: AccountDelegateHistoryResponse;
	delegate: Resource<DelegateBalance[]>;
};

export const AccounDelegateHistoryChart = (
	props: AccounDelegateHistoryChartProps
) => {
	const theme = useTheme();

	const { account, delegateHistory, delegate } = props;

	const verifiedDelegates = useVerifiedDelegates();

	const loading = delegateHistory.loading;
	const timestamps = useMemo(() => {
		let suffix: string[] = [];
		if (delegate.data && delegate.data.length > 0) {
			const now = new Date();
			now.setDate(now.getDate() + 1);
			suffix = [now.toUTCString()];
		}
		if (!delegateHistory.data) return [...suffix];
		const resp = (delegateHistory.data as any).reduce(
			(prev: string[], cur: AccountDelegateHistory) => {
				if (prev.find((x) => x === cur.timestamp) === undefined)
					prev.push(cur.timestamp);
				return prev;
			},
			[]
		);
		return [...resp, ...suffix];
	}, [delegateHistory]);

	const maxDelegate = useMemo(() => {
		if (!delegateHistory.data) return 0;
		const resp = (delegateHistory.data as any).reduce(
			(prev: number, cur: AccountDelegateHistory) => {
				const now = rawAmountToDecimal(cur.amount.toString()).toNumber();
				return now > prev ? now : prev;
			},
			0
		);
		return delegate.data?.reduce((prev: number, cur: DelegateBalance) => {
			const now = rawAmountToDecimal(cur.amount.toString()).toNumber();
			return now > prev ? now : prev;
		}, resp);
	}, [delegateHistory]);

	const delegates = useMemo(() => {
		if (!delegate.data) return [];
		if (!delegateHistory.data) return [];
		const resp = (delegateHistory.data as any).reduce(
			(prev: ApexAxisChartSeries, cur: AccountDelegateHistory) => {
				const info = verifiedDelegates[cur.delegate];
				const delegate = info?.name || cur.delegate;
				let serie = prev.find((x) => x.name === delegate);
				if (serie === undefined)
					prev.push({
						name: delegate,
						type: "area",
						data: [],
					});
				serie = prev.find((x) => x.name === delegate);
				serie?.data.push({
					x: cur.timestamp,
					y: rawAmountToDecimal(cur.amount.toString()).toNumber(),
				} as any);
				return prev;
			},
			[]
		);

		return delegate.data?.reduce(
			(prev: ApexAxisChartSeries, cur: DelegateBalance) => {
				const info = verifiedDelegates[cur.delegate];
				const delegate = info?.name || cur.delegate;
				let serie = prev.find((x) => x.name === delegate);
				if (serie === undefined)
					prev.push({
						name: delegate,
						type: "area",
						data: [],
					});
				serie = prev.find((x) => x.name === delegate);
				const now = new Date();
				now.setDate(now.getDate() + 1);
				serie?.data.push({
					x: now.toUTCString(),
					y: rawAmountToDecimal(cur.amount.toString()).toNumber(),
				} as any);
				return prev;
			},
			resp
		);
	}, [delegateHistory]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={400}
			series={delegates}
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
								filename: `delegation-${account}`,
								headerCategory: "Date",
							},
							png: {
								filename: `delegation-${account}`,
							},
							svg: {
								filename: `delegation-${account}`,
							},
						},
					},
					zoom: {
						enabled: true,
					},
				},
				colors: [
					theme.palette.error.main,
					theme.palette.success.main,
					theme.palette.neutral.main,
					"#4C3B4D",
					"#813405",
					"#247BA0",
					"#606C38",
					"#727D71",
					"#474747",
					"#511730",
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
					text: "No delegation yet",
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
						formatter: (val: number) =>
							NETWORK_CONFIG.currency + " " + nFormatter(val, 2).toString(),
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
						formatter: (val: number) => nFormatter(val, 2).toString(),
					},
					axisTicks: {
						show: false,
					},
					axisBorder: {
						show: false,
					},
					min: 0,
					max: maxDelegate,
				},
			}}
		/>
	);
};
