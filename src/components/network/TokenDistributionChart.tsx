/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { css, useTheme } from "@emotion/react";
import { Tokenomics } from "../../model/stats";

import Chart from "react-apexcharts";
import { StatItem } from "./StatItem";
import { formatNumber, nFormatter } from "../../utils/number";

const chartContainer = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const supplyInfo = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  @media only screen and (max-width: 767px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export type TokenDistributionChartProps = HTMLAttributes<HTMLDivElement> & {
	token: Tokenomics;
};

export const TokenDistributionChart = (props: TokenDistributionChartProps) => {
	const { token } = props;
	const theme = useTheme();

	return (
		<div css={chartContainer}>
			<div css={supplyInfo}>
				<StatItem
					title='Total Supply'
					value={`${formatNumber(token.totalSupply)} 𝞃`}
				/>
				<StatItem
					title='Circulating Supply'
					value={`${formatNumber(token.currentSupply)} 𝞃`}
				/>
			</div>
			<Chart
				options={{
					labels: [
						`Circulating Delegated/Staked (${(
							(token.delegatedSupply / token.currentSupply) *
              100
						).toFixed(2)}% of ${nFormatter(token.currentSupply, 2)})`,
						`Circulating Free (${(
							100 -
              (token.delegatedSupply / token.currentSupply) * 100
						).toFixed(2)}% of ${nFormatter(token.currentSupply, 2)})`,
						`Unissued (${(
							100 -
              (token.currentSupply / token.totalSupply) * 100
						).toFixed(2)}% of ${nFormatter(token.totalSupply, 2)})`,
					],
					colors: ["#14dec2", "#FF9900", "#848484"],
					dataLabels: {
						enabled: false,
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
				}}
				series={[
					token.delegatedSupply,
					token.currentSupply - token.delegatedSupply,
					token.totalSupply - token.currentSupply,
				]}
				type='donut'
				height={400}
			/>
		</div>
	);
};
